class CreateImage
    @name = "CreateImage"

    constructor: () ->
        # BITMAPFILEHEADER
        @bfType = iniAr2f.call @
        @bfSize = iniAr4f.call @
        @bfReserved1 = iniAr2f.call @
        @bfReserved2 = iniAr2f.call @
        @bfOffBits = iniAr4f.call @
        # BITMAPINFOHEADER
        @bcSize = iniAr4f.call @
        @bcWidth = iniAr4f.call @
        @bcHeight = iniAr4f.call @
        @bcPlanes = iniAr2f.call @
        @bcBitCount = iniAr2f.call @
        @biCompression = iniAr4f.call @
        @biSizeImage = iniAr4f.call @
        @biXPelsPerMeter = iniAr4f.call @
        @biYPelsPerMeter = iniAr4f.call @
        @biClrUsed = iniAr4f.call @
        @biClrImportant = iniAr4f.call @
        # RGBQUAD
        @colorpallets = []
        # DATA
        @data = []

    Do: (data, colors, wsize, hsize, filename, ext) ->
        return createImage.call @, @makeData(data, colors, wsize, hsize), filename,
        if ext == "bmp" then "image/bmp"
        else if ext == "gif" then "image/gif"
        else if ext == "jpg" then "image/jpeg"
        else if ext == "png" then "image/png"
        else "image/png"

    makeData: (data, colors, wsize, hsize) ->
        @bfType = [66, 77]
        @bcSize = convByteSlice.call @, 40, 4
        @bcWidth = convByteSlice.call @, wsize, 4
        @bcHeight = convByteSlice.call @, hsize, 4
        @bcPlanes = convByteSlice.call @, 1, 2
        @bcBitCount = convByteSlice.call @, 8, 2
        @biXPelsPerMeter = convByteSlice.call @, 1, 4
        @biYPelsPerMeter = convByteSlice.call @, 1, 4
        for e in colors
            @colorpallets.push([
                (convByteSlice.call @, e[2], 1)[0],
                (convByteSlice.call @, e[1], 1)[0],
                (convByteSlice.call @, e[0], 1)[0],
                0
            ])
        addData.call @, data
        size_headers = 54 + @colorpallets.length * 4
        size_image = data.length
        @bfOffBits = convByteSlice.call @, size_headers, 4
        @biSizeImage = convByteSlice.call @, size_image, 4
        @bfSize = convByteSlice.call @, size_headers + size_image, 4
        BITMAPFILEHEADER = [this.bfType, this.bfSize, this.bfReserved1, this.bfReserved2, this.bfOffBits]
        BITMAPINFOHEADER = [this.bcSize, this.bcWidth, this.bcHeight, this.bcPlanes, this.bcBitCount, this.biCompression, this.biSizeImage, this.biXPelsPerMeter, this.biYPelsPerMeter, this.biClrUsed, this.biClrImportant]
        RGBQUAD = this.colorpallets
        ar = BITMAPFILEHEADER.concat(BITMAPINFOHEADER).concat(RGBQUAD).concat(this.data)
        return Array.prototype.concat.apply([], ar)

    createImage = (bytear, filename, mimetype) ->
        blob = Utilities.newBlob(bytear, "image/bmp", filename).getAs(mimetype)
        try
            id = DriveApp.createFile(blob).getId()
        catch e
            throw new Error "Error: Couldn't create image file. I'm sorry. Please check your data again."
        return id

    addData = (d) ->
        this.data.push((convByteSlice.call @, e, 1)[0] for e in d)

    convByteSlice = (number, b) ->
        ar1 = []
        ar2 = []
        ar1 = parseInt(number, 10).toString(16)
        if ar1.length % 2 isnt 0
            ar1 = "0" + ar1
        for i in [0..ar1.length - 1] by 2
            t1 = (Array(2).join('0') + ar1.substr(i, 2)).slice(-2)
            ta1 = t1.slice(0,1)
            ta2 = t1.slice(1,2)
            tb1 = (Array(4).join('0') + parseInt(ta1, 16).toString(2)).slice(-4)
            tb2 = (Array(4).join('0') + parseInt(ta2, 16).toString(2)).slice(-4)
            ar2.push(tb1 + tb2)
        for i, e of ar2
            if parseInt(e.slice(0,1)) == 1
                temp = ""
                for j in [0..e.length - 1]
                    tempn = 0
                    if parseInt(e.substr(j, 1)) == 0
                        tempn = 1
                    temp += tempn
                res = -1 * parseInt(parseInt((Array(8).join('0') + parseInt(parseInt(parseInt(temp, 2).toString(10), 10) + 1, 10).toString(2)).slice(-8), 2).toString(10), 10)
            else
                res = parseInt(parseInt(e, 2).toString(10), 10)
            ar2[i] = res
        try
            res = ar2.reverse().concat(Array.apply(null, Array(b - ar2.length)).map(-> return 0))
        catch e
            throw new Error "Error: Value is over 255. Value has to be less than 255 which is the colow index. Please check again."
        return res

    iniAr2f = () ->
        return new Array(0,0)

    iniAr4f = () ->
        return new Array(0,0,0,0)

mandelbrot = (size) ->
    if size % 4 isnt 0
        size = size + 4 - (size % 4)
    r =
    sh:   3.0,
    sw:   2.0,
    sa:   20,
    size: size
    results = []
    for j in [0..r.size - 1]
        for i in [0..r.size - 1]
            xx = 0.0
            yy = 0.0
            d = true
            for k in [0..r.sa - 1]
                xx1 = (Math.pow(xx, 2) - Math.pow(yy, 2)) - r.sh / 2 + (2.0 / r.size * i)
                yy1 = (2 * xx * yy) - r.sw / 2 + (2.0 / r.size * j)
                xx = xx1
                yy = yy1
                if Math.pow(xx, 2) + Math.pow(yy, 2) > 4
                    d = false
                    break
            results.push(if d then 1 else 0)
    return results

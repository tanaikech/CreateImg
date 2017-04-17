/**
 * This method creates an image using coordinates, colors (8 bits) and size.
 * Although I had been looking for such libraries or methods for GAS, I have never seen them. So I make this.
 * You can choose output image format. Output file is created to the route folder on Google Drive.
 * The limitation of this library.
 *   - Colors are 8 bits.
 *   - Coordinates for x axis and y axis are the multiples of 4.
 * @param {int[]} data Coordinates of color index. Color index is corresponding to the index of color code array.
 * @param {int[][]} colors Color code [[r, g, b], [r, g, b],,,]. Each parameter is 0 - 255.
 * @param {int} wsize Image width.
 * @param {int} hsize Image height.
 * @param {string} filename Output filename on Google Drive.
 * @param {string} ext Extension of output image format. You can choose from bmp, gif, jpg and png.
 * @return {string} fileid File ID of the created image.
 */
function Do(data, colors, wsize, hsize, filename, ext) {
  MI = new CreateImage();
  return MI.Do(data, colors, wsize, hsize, filename, ext);
}

var CreateImage = (function() {
  var addData, convByteSlice, createImage, iniAr2f, iniAr4f;

  CreateImage.name = "CreateImage";

  function CreateImage() {
    this.bfType = iniAr2f.call(this);
    this.bfSize = iniAr4f.call(this);
    this.bfReserved1 = iniAr2f.call(this);
    this.bfReserved2 = iniAr2f.call(this);
    this.bfOffBits = iniAr4f.call(this);
    this.bcSize = iniAr4f.call(this);
    this.bcWidth = iniAr4f.call(this);
    this.bcHeight = iniAr4f.call(this);
    this.bcPlanes = iniAr2f.call(this);
    this.bcBitCount = iniAr2f.call(this);
    this.biCompression = iniAr4f.call(this);
    this.biSizeImage = iniAr4f.call(this);
    this.biXPelsPerMeter = iniAr4f.call(this);
    this.biYPelsPerMeter = iniAr4f.call(this);
    this.biClrUsed = iniAr4f.call(this);
    this.biClrImportant = iniAr4f.call(this);
    this.colorpallets = [];
    this.data = [];
  }

  CreateImage.prototype.Do = function(data, colors, wsize, hsize, filename, ext) {
    return createImage.call(this, this.makeData(data, colors, wsize, hsize), filename, ext === "bmp" ? "image/bmp" : ext === "gif" ? "image/gif" : ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/png");
  };

  CreateImage.prototype.makeData = function(data, colors, wsize, hsize) {
    var BITMAPFILEHEADER, BITMAPINFOHEADER, RGBQUAD, ar, e, l, len, size_headers, size_image;
    this.bfType = [66, 77];
    this.bcSize = convByteSlice.call(this, 40, 4);
    this.bcWidth = convByteSlice.call(this, wsize, 4);
    this.bcHeight = convByteSlice.call(this, hsize, 4);
    this.bcPlanes = convByteSlice.call(this, 1, 2);
    this.bcBitCount = convByteSlice.call(this, 8, 2);
    this.biXPelsPerMeter = convByteSlice.call(this, 1, 4);
    this.biYPelsPerMeter = convByteSlice.call(this, 1, 4);
    for (l = 0, len = colors.length; l < len; l++) {
      e = colors[l];
      this.colorpallets.push([(convByteSlice.call(this, e[2], 1))[0], (convByteSlice.call(this, e[1], 1))[0], (convByteSlice.call(this, e[0], 1))[0], 0]);
    }
    addData.call(this, data);
    size_headers = 54 + this.colorpallets.length * 4;
    size_image = data.length;
    this.bfOffBits = convByteSlice.call(this, size_headers, 4);
    this.biSizeImage = convByteSlice.call(this, size_image, 4);
    this.bfSize = convByteSlice.call(this, size_headers + size_image, 4);
    BITMAPFILEHEADER = [this.bfType, this.bfSize, this.bfReserved1, this.bfReserved2, this.bfOffBits];
    BITMAPINFOHEADER = [this.bcSize, this.bcWidth, this.bcHeight, this.bcPlanes, this.bcBitCount, this.biCompression, this.biSizeImage, this.biXPelsPerMeter, this.biYPelsPerMeter, this.biClrUsed, this.biClrImportant];
    RGBQUAD = this.colorpallets;
    ar = BITMAPFILEHEADER.concat(BITMAPINFOHEADER).concat(RGBQUAD).concat(this.data);
    return Array.prototype.concat.apply([], ar);
  };

  createImage = function(bytear, filename, mimetype) {
    var blob, e, id;
    blob = Utilities.newBlob(bytear, "image/bmp", filename).getAs(mimetype);
    try {
      id = DriveApp.createFile(blob).getId();
    } catch (error) {
      e = error;
      throw new Error("Error: Couldn't create image file. I'm sorry. Please check your data again.");
    }
    return id;
  };

  addData = function(d) {
    var e;
    return this.data.push((function() {
      var l, len, results1;
      results1 = [];
      for (l = 0, len = d.length; l < len; l++) {
        e = d[l];
        results1.push((convByteSlice.call(this, e, 1))[0]);
      }
      return results1;
    }).call(this));
  };

  convByteSlice = function(number, b) {
    var ar1, ar2, e, i, j, l, m, ref, ref1, res, t1, ta1, ta2, tb1, tb2, temp, tempn;
    ar1 = [];
    ar2 = [];
    ar1 = parseInt(number, 10).toString(16);
    if (ar1.length % 2 !== 0) {
      ar1 = "0" + ar1;
    }
    for (i = l = 0, ref = ar1.length - 1; l <= ref; i = l += 2) {
      t1 = (Array(2).join('0') + ar1.substr(i, 2)).slice(-2);
      ta1 = t1.slice(0, 1);
      ta2 = t1.slice(1, 2);
      tb1 = (Array(4).join('0') + parseInt(ta1, 16).toString(2)).slice(-4);
      tb2 = (Array(4).join('0') + parseInt(ta2, 16).toString(2)).slice(-4);
      ar2.push(tb1 + tb2);
    }
    for (i in ar2) {
      e = ar2[i];
      if (parseInt(e.slice(0, 1)) === 1) {
        temp = "";
        for (j = m = 0, ref1 = e.length - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; j = 0 <= ref1 ? ++m : --m) {
          tempn = 0;
          if (parseInt(e.substr(j, 1)) === 0) {
            tempn = 1;
          }
          temp += tempn;
        }
        res = -1 * parseInt(parseInt((Array(8).join('0') + parseInt(parseInt(parseInt(temp, 2).toString(10), 10) + 1, 10).toString(2)).slice(-8), 2).toString(10), 10);
      } else {
        res = parseInt(parseInt(e, 2).toString(10), 10);
      }
      ar2[i] = res;
    }
    try {
      res = ar2.reverse().concat(Array.apply(null, Array(b - ar2.length)).map(function() {
        return 0;
      }));
    } catch (error) {
      e = error;
      throw new Error("Error: Value is over 255. Value has to be less than 255 which is the colow index. Please check again.");
    }
    return res;
  };

  iniAr2f = function() {
    return new Array(0, 0);
  };

  iniAr4f = function() {
    return new Array(0, 0, 0, 0);
  };

  return CreateImage;

})();

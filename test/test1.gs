function test_main() {
  var wsize = 512;
  var hsize = 128;
  var data = [];
  for (var h = 0; h < hsize; h++) {
    for (var w = 0; w < wsize; w++) {
      data.push(255 * w / wsize);
    }
  }

  var colors = [];
  var numberofcolors = 256;
  for (var i = 0; i < numberofcolors; i++) {
    colors.push([i, 199, 39]);
  }

  var fileid = CreateImg.Do(data, colors, wsize, hsize, "sample1.png", "png");
  Logger.log(fileid)
}

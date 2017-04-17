function mandelbrot(size) {
  var r = {
    sh:   3.0,
    sw:   2.0,
    sa:   20,
    size: size
  };
  var results = [];
  for (var j = 0; j < r.size; j++) {
    for (var i = 0; i < r.size; i++) {
      var xx = 0.0;
      var yy = 0.0;
      var d = true;
      for (var k = 0; k < r.sa; k++) {
        var xx1 = (Math.pow(xx, 2) - Math.pow(yy, 2)) - r.sh / 2 + (2.0 / r.size * i);
        var yy1 = (2 * xx * yy) - r.sw / 2 + (2.0 / r.size * j);
        xx = xx1;
        yy = yy1;
        if (Math.pow(xx, 2)+Math.pow(yy, 2) > 4) {
          d = false;
          break;
        }
      }
      results.push(d ? 1 : 0);
    }
  }
  return results;
}

function test_main(){
  var colors = [[255, 255, 255], [255, 100, 0]]; // Outer color, Inner color
  var fileid = CreateImg.Do(mandelbrot(256), colors, 256, 256, "sample2.png", "png");
  Logger.log(fileid)
}

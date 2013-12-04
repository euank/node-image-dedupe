var Image = require('node-oiio');

/*
 * This comparison algorithm naively subtracts
 * the colour values of pixels at each point for
 * images of the same dimensions. The difference
 * is then the percent difference present vs
 * total possible. e.g. maximum for a 1x1 image
 * would be 255 (average of 255 at each channel)
 * and the minimum would be 0.
 *
 * Since all diff functions should return the
 * confidence that they're the same, we then
 * need to scale it somehow from 100-0 to 0-100.
 * Initially this will just be 100-x, but it should
 * probably be changed to better match other algos
 * if they aren't returning similar values to this
 * one.
 */

module.exports = function(lhs, rhs) {
  var maxW = Math.max(lhs.width, rhs.width);
  var maxH = Math.max(lhs.height, rhs.height);
  var i1 = lhs.scale(maxW, maxH);
  var i2 = rhs.scale(maxW, maxH);

  var pixelDifference = 0;
  for(var x=0;x<i1.width;x++) {
    for(var y=0;y<i1.height;y++) {
      //Wish js had operator overloading.
      pixelDifference += (i1.getPixel(x,y).minus(i2.getPixel(x,y))).abs().getAvg();
    }
  }
  var maxPixelDifference = i1.width * i2.height * 255;
  var percentDifference = pixelDifference / maxPixelDifference;
  var similarness = 1.0 - percentDifference;

  return similarness;
};

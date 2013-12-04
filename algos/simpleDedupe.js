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


module.exports.default = false;
module.exports.name = "Dumb diff";

module.exports.dedupe = function(lhs, rhs) {
  if(!(lhs instanceof Image && rhs instanceof Image)) {
    throw new TypeError("Invalid arguments");
  }
  if(lhs.width != rhs.width || lhs.height != rhs.height) {
    throw new Error("Arguments must have same dimensions");
  }

  var pixelDifference = 0;
  for(var x=0;x<lhs.width;x++) {
    for(var y=0;y<lhs.height;y++) {
      //Wish js had operator overloading.
      pixelDifference += (lhs.getPixel(x,y).minus(rhs.getPixel(x,y))).abs().getAvg();
    }
  }
  var maxPixelDifference = lhs.width * lhs.height * 255;
  var percentDifference = pixelDifference / maxPixelDifference;
  var similarness = 1.0 - percentDifference;

  return similarness;
};

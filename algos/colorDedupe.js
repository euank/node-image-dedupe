
var Image = require('node-oiio');

var cache = {};

module.exports.default = true;
module.exports.name = "Color spectrum";

module.exports.dedupe = function(lhs, rhs) {
  return this.diffBlobs(this.getBlob(lhs), this.getBlob(rhs));
};

module.exports.getBlob = function(img) {
  return img.getMoments();
};

module.exports.diffBlobs = function(blob1, blob2) {
  var n = Math.max(blob1.length, blob2.length);
  var w1=1/n,w2=1/n,w3=1/n;

  var val = 0;
  for(var i=0;i<blob1.length || i < blob2.length;i++) {
    if(blob1.length <= i) {
      if(i==3) continue; //Ignore alpha
    }
    if(blob2.length <= i) {
      if(i == 3) continue;
    }
    val += w1 * Math.abs(blob1[i].average - blob2[i].average) 
         + w2 * Math.abs(blob1[i].variance - blob2[i].variance) 
         + w3 * Math.abs(blob1[i].skewness - blob2[i].skewness);
  }
  return 1 - val / (255 * 2);
};

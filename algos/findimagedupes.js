var Image = require('node-oiio');

module.exports.default = false;
module.exports.name = 'findimagedupes blob';

module.exports.dedupe = function(lhs, rhs) {
  return this.diffBlobs(this.getBlob(lhs), this.getBlob(rhs));
};

function bitsSet(num) {
  var ret = 0;
  for(var i=0;i<8;i++) {
    if(num & (1 << i)) ret++;
  }
  return ret;
}

module.exports.getBlob = function(img) {
  var blob = img.sample(160,160).grayScale().blur(3,99).normalize().sample(16,16);
  return blob.binaryBlob();
};

module.exports.diffBlobs = function(blob1, blob2) {
  var ones = 0;
  for(var i=0;i<blob1.length;i++) {
    ones += bitsSet(blob1[i] ^ blob2[i]);
  }
  return 1.0 - ones / (blob1.length * 8);
};

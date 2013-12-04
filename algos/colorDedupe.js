
var Image = require('node-oiio');

var cache = {};

module.exports = function(lhs, rhs) {
  var m1,m2;
  if(cache[lhs.path]) m1 = cache[lhs.path];
  else {
    m1 = lhs.getMoments();
    cache[lhs.path] = m1;
  }
  if(cache[rhs.path]) m2 = cache[rhs.path];
  else {
    m2 = rhs.getMoments();
    cache[rhs.path] = m2;
  }

  var n = Math.max(m1.length, m2.length);
  var w1=1/n,w2=1/n,w3=1/n;

  var val = 0;
  for(var i=0;i<m1.length || i < m2.length;i++) {
    if(m1.length <= i) {
      if(i==3) continue; //Ignore alpha
    }
    if(m2.length <= i) {
      if(i == 3) continue;
    }
    val += w1 * Math.abs(m1[i].average - m2[i].average) 
         + w2 * Math.abs(m1[i].variance - m2[i].variance) 
         + w3 * Math.abs(m1[i].skewness - m2[i].skewness);
  }
  return 1 - val / (255 * 2);
};

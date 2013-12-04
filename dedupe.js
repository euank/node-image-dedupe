var program = require("commander");
var Image = require("node-oiio");
var simple = require("./algos/simpleDedupe");
var ssimple = require("./algos/scaledSimpleDedupe");
var cdedupe = require("./algos/colorDedupe");

var parsed = program
  .usage('[options] <files ...>')
  .option("-c --confidence  [amount]", "Difference confidence threshold")
  .parse(process.argv);

if(parsed.args.length < 2) {
  console.error("Please provide at least two files as arguments");
  process.exit(1);
}

var imgs = [];
parsed.args.forEach(function(img) {
  try {
    var anImage = new Image(img);
    imgs.push(anImage);
  } catch(e) {
    console.log(e.message);
  }
});

var dupePairs = [];
for(var i=0;i<imgs.length;i++) {
  for(var j=i+1;j<imgs.length;j++) {
    dupePairs.push({
      lhs: imgs[i].path,
      rhs: imgs[j].path,
      dupe: cdedupe(imgs[i], imgs[j])
    });
    console.log(dupePairs.reduce(function(l,r){return r;}));
  }
}

console.log(dupePairs);

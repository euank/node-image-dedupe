var program = require("commander");
var Image = require("node-oiio");
var simple = require("./simpleDedupe");

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
      lhs: i,
      rhs: j,
      dupe: simple(imgs[i], imgs[j])
    });
  }
}

console.log(dupePairs);

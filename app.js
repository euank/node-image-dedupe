var express = require('express')
  , routes = require('./routes')
  , image = require('./routes/image')
  , Image = require('node-oiio')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , redis = require('redis')
  , async = require('async')
  , client = redis.createClient();

var dedupeAlgorithms = [];
var algoObjs = fs.readdirSync("./algos");
algoObjs.forEach(function(obj) {
  var algo = require("./algos/"+obj);
  dedupeAlgorithms.push({
    algo: algo,
    name: algo.name,
    default: algo.default
  });
});

client.on('error', console.log);

image.redis(client);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: 'imgs'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/image', image.upload);
app.get('/images', image.list);
app.get('/algorithms', function(req, res) {
  res.send(dedupeAlgorithms.map(function(item) { 
    return {name: item.name, default: item.default}
  }));
});
app.post('/dedupe', function(req, res) {
  var imgsToDedupe = req.body.imgs;
  console.log(req.body);
  var algo = dedupeAlgorithms.reduce(function(l,r) { return l.name == req.body.algo.name ? l: r.name == req.body.algo.name ? r : l;}).algo;
  var resp = [];
  console.log(algo);
  if(algo.getBlob) {
    /* "quick" time :S */
    async.map(imgsToDedupe, function(img, cb) {
      client.get("algo:" + algo.name + ":" + img, function(err, val) {
        cb(val);
      });
    }, function(err, results) {
      var pairs = [];
      for(var i=0;i<imgsToDedupe.length;i++) {
        pairs.push([]);
        for(var j=0;j<imgsToDedupe.length;j++) {
          if(i==j) {
            pairs[i][j] = null;
            continue;
          } else if(results[i] && results[j]) {
          } else if(results[i]) {
            results[j] = algo.getBlob(new Image(imgsToDedupe[j]));
            client.set("algo:" + algo.name + ":" + imgsToDedupe[j], results[j]);
          } else if(results[j]) {
            results[i] = algo.getBlob(new Image(imgsToDedupe[i]));
            client.set("algo:" + algo.name + ":" + imgsToDedupe[i], results[i]);
          } else {
            results[i] = algo.getBlob(new Image(imgsToDedupe[i]));
            results[j] = algo.getBlob(new Image(imgsToDedupe[j]));
            client.set("algo:" + algo.name + ":" + imgsToDedupe[j], results[j]);
            client.set("algo:" + algo.name + ":" + imgsToDedupe[i], results[i]);
          }
          console.log(results);
          pairs[i][j] = algo.diffBlobs(results[i], results[j]);
        }
      }
      var ret = [];
      for(var i=0;i<imgsToDedupe.length;i++) {
        var r = {src: imgsToDedupe[i],dupes:[]};
        for(var j=0;j<imgsToDedupe.length;j++) {
          if(i==j) continue;
          r.dupes.push({path: imgsToDedupe[j], percent: Math.round(pairs[i][j] * 1000)/10});
        }
        ret.push(r);
      }
      console.log(ret);
      res.send(ret);
    });

  } else {
    var pairs = [];
    for(var i=0;i<imgsToDedupe.length;i++) {
      pairs.push([]);
      for(var j=0;j<imgsToDedupe.length;j++) {
        if(i==j) pairs[i][j] = null;
        else pairs[i][j] = algo.dedupe(new Image(imgsToDedupe[i]), new Image(imgsToDedupe[j]));
      }
    }
    var ret = [];
    for(var i=0;i<imgsToDedupe.length;i++) {
      var r = {src: imgsToDedupe[i],dupes:[]};
      for(var j=0;j<imgsToDedupe.length;j++) {
        if(i==j) continue;
        r.dupes.push({path: imgsToDedupe[j], percent: Math.round(pairs[i][j] * 1000)/10});
      }
      ret.push(r);
    }
    console.log(ret);
    res.send(ret);
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

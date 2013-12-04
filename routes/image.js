var client;
exports.redis = function(c) { client = c; };

exports.list = function(req, res) {
  client.keys("filename:*", function(err, replies) {
    client.mget(replies, function(err, vals) {
      var imgs = [];
      for(var i=0;i<replies.length;i++) {
        var val = JSON.parse(vals[i]);
        imgs.push({path: replies[i].replace(/^filename:/,''), name: val.name, time: val.time});
      }
      res.send(imgs);
    });
  });
}

exports.upload = function(req, res) {
  var filename = req.files.file.originalFilename;
  var path = req.files.file.path;
  client.set("filename:"+path, JSON.stringify({name: filename, time: Date.now()}));
  res.send({ok: 1});
};

node-image-dedupe
=================

Image Deduplication in NodeJS

An example of this running can be found [here](http://dedupe.euank.com).

Installation
------------

Dependencies: OpenImageIO, redis-server, nodejs, npm

Example install on ubuntu (modify to taste):
```
apt-get install libopenimageio-dev redis-server nodejs nginx
cp nginx.example.conf /etc/nginx/sites-enabled/dedupe
npm install
mkdir imgs
node app.js
```

Usage
-----

Navigate to the site and click away

node-image-dedupe
=================

Image Deduplication in NodeJS

An example of this running can be found [here](http://dedupe.euank.com). This demo instance of it will be frequently whiped.

This was created as a school project and is no longer maintained. I recommend looking at other projects (such as [phash](http://www.phash.org/)) if you are looking for a more robust solution.

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

Alternately, just use the included Dockerfile and/or fig.yml by typing `docker build .` or `fig up` respectively.

Usage
-----

Navigate to the site and select the images you would like to compare, choose an algorithm, click calculate, and wait for the results. Some algorithms will take time.

'use strict';

var through2 = require('through2');
var fs = require('graceful-fs');
var prepDestAndResponse = require('../common').prepDestAndResponse;

function symlink(outFolder, opt) {
  function linkFile (file, enc, cb) {
    var srcPath = file.path;

    prepDestAndResponse(outFolder, file, opt, function (err, writePath) {
      fs.symlink(srcPath, writePath, function (err) {
        if (err && err.code !== 'EEXIST') {
          return cb(err);
        }

        cb(null, file);
      });
    });
  }

  var stream = through2.obj(linkFile);
  // TODO: option for either backpressure or lossy
  stream.resume();
  return stream;
}

module.exports = symlink;

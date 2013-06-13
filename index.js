#!/usr/local/bin/node

var watch  = require('watch')
  , knox   = require('knox')
  , fs     = require('fs')
  , path   = require('path')
  , sys    = require('child_process')
  , encode = encodeURIComponent
  ;

var knoxClient = knox.createClient({
    bucket: process.argv[2]
  , key: process.argv[3]
  , secret: process.argv[4]
});

/** TODO need more mime types? **/
var contentTypes = {
  '.png': 'image/png'
};

function copyToClipboard(err, resp) {
  console.log(resp.body)
  console.log(arguments);
}

watch.createMonitor('/Users/beckel/Pictures/screens', function (monitor) {
  monitor.on('created', function (f, stat) {

    fs.stat(f, function (err, stats) {

      var readStream = fs.createReadStream(f);
      var dstUrl = '/' + encode(path.basename(f));

      console.log(dstUrl)
      var req = knoxClient.putStream(readStream, dstUrl, {
        'Content-Length': stats.size,
        'Content-Type': contentTypes[path.extname(f)],
        'x-amz-acl': 'public-read',
      }, function (err, resp) {
        console.log(req.url);

        sys.exec('echo ' + req.url + ' | pbcopy');
      });

    });
  })
})

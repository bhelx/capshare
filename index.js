#!/usr/local/bin/node

var watch   = require('watch')
  , knox    = require('knox')
  , path    = require('path')
  , fs      = require('fs')
  , sys     = require('child_process')
  , encode  = encodeURIComponent
  , content = require('./contentTypes')
  ;

var knoxClient = knox.createClient({
    bucket: process.argv[3]
  , key: process.argv[4]
  , secret: process.argv[5]
});

// determine which shell command to use for [clipboard] copying
var copyCmd = (function() {
  var commands = {linux: 'xclip -selection CLIPBOARD', darwin: 'pbcopy'};
  return commands[process.platform];
})();

watch.createMonitor(process.argv[2], function (monitor) {
  monitor.on('created', function (f, stats) {

    var readStream = fs.createReadStream(f);
    var dstUrl = '/' + encode(path.basename(f));

    var req = knoxClient.putStream(readStream, dstUrl, {
      'Content-Length': stats.size,
      'Content-Type': content(path.extname(f)),
      'x-amz-acl': 'public-read',
    }, function (err, resp) {
      console.log(req.url);

      sys.exec('echo ' + req.url + ' | ' + copyCmd);
    });
  });
});

// graceful exit on SIGTERM
process.on('SIGTERM', function() {
  process.exit();
});

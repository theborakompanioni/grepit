var grepit = require('./src/grepit');

var fs = require('fs');
var vo = require('vo');
var SYSTEM_EOL = require('os').EOL;


var inputFiles = 'examples/links.txt';
var outputDirectory = 'out';

//split the read links on operating-specific newlines into an array
var links = fs.readFileSync(inputFiles)
  .toString()
  .split(SYSTEM_EOL)
  .filter(link => {
    //filter out blank lines
    return !(/^\s*$/.test(link));
  })
  .filter(link => {
    //filter out non http links
    return (/^http.*$/.test(link));
  });

var run = grepit(links, {
  outputDirectory: outputDirectory,
  querySelector: 'html'
});

vo(run)(function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('done');
  }
});

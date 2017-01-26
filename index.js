var chunkArray = require('./src/util/chunkArray');
var shuffleArray = require('./src/util/shuffleArray');
var grepit = require('./src/grepit');

var fs = require('fs');
var vo = require('vo');
var os = require('os');
var _ = require('lodash');

var SYSTEM_EOL = os.EOL;
var cpuCoresCount = os.cpus().length;

var options = _.defaults({}, {
  inputFiles: 'examples/links.txt',
  outputDirectory: 'out',
  browserInstances: Math.max(cpuCoresCount, 1),
  showBrowser: true,
  shuffleLinks: true,
  debug: true
});
var grepitOptions = _.defaults({}, {
  outputDirectory: 'out',
  debug: options.debug,
  showBrowser: options.showBrowser
});

//split the read links on operating-specific newlines into an array
var links = fs.readFileSync(options.inputFiles)
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

var calcChunkSize = (links, options) => {
  return links.length <= options.browserInstances ? links.length : Math.ceil(links.length / options.browserInstances);
};

var shuffledOrOrderedLinks = options.shuffleLinks ? shuffleArray(links) : links;
var chunkedLinkLists = chunkArray(shuffledOrOrderedLinks, calcChunkSize(links, options));

var runnables = chunkedLinkLists
  .map(links => grepit(links, grepitOptions));

vo(runnables)
  .then(foo => console.log('done'))
  .catch(e => console.error(e));

var chunkArray = require('./src/util/chunkArray');
var shuffleArray = require('./src/util/shuffleArray');
var download = require('./src/download');

var fs = require('fs');
var vo = require('vo');
var os = require('os');
var _ = require('lodash');
var commander = require('commander');

var SYSTEM_EOL = os.EOL;
var cpuCoresCount = os.cpus().length;

var DEFAULT_OPTIONS = _.defaults({}, {
  inputDirectory: 'examples/links.txt',
  outputDirectory: 'out',
  browserInstances: Math.max(cpuCoresCount, 1),
  fetchTimeout: 10000,
  showBrowser: false,
  shuffleLinks: false,
  debug: false
});

var readInputFiles = function readInputFiles(inputDirectory) {
//split the read links on operating-specific newlines into an array
  return fs.readFileSync(inputDirectory)
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
};

commander
  .version('0.0.1')
  .option('-v, --verbose', 'Display more fine grained log messages.')
  .option('-debug, --debug', 'Display more fine grained log messages.');

commander.command('help', null, {isDefault: true})
  .description('display help information.')
  .action(function () {
    commander.outputHelp();
  });

commander
  .command('download')
  .alias('start')
  .description('start downloading page contents to output directory')
  .option('-i, --input-directory [indir]', 'The directory where to load inputs from.', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'The directory where results are saved.', DEFAULT_OPTIONS.outputDirectory)
  .option('-i, --browser-instances [browser]', 'Number of browsers to use.', str => parseInt(str, 10), DEFAULT_OPTIONS.browserInstances)
  .option('-i, --fetch-timeout [timeout]', 'Number of browsers to use.', str => parseInt(str, 10), DEFAULT_OPTIONS.fetchTimeout)
  .option('-b, --show-browser [show]', 'Whether to show the browser window or run in headless mode.', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-links [shuffle]', 'Whether to shuffle input data before executing', DEFAULT_OPTIONS.shuffleLinks)
  .action(function (cmd) {
    var options = _.defaults(cmd, DEFAULT_OPTIONS);

    var links = readInputFiles(options.inputDirectory);

    var calcChunkSize = (links) => {
      return links.length <= options.browserInstances ? links.length : Math.ceil(links.length / options.browserInstances);
    };

    var shuffledOrOrderedLinks = options.shuffleLinks ? shuffleArray(links) : links;
    var chunkedLinkLists = chunkArray(shuffledOrOrderedLinks, calcChunkSize(links));

    var runnables = chunkedLinkLists
      .map(links => download(links, options));

    vo(runnables)
      .then(foo => console.log('done'))
      .catch(e => console.error(e));
  });

commander
  .command('*')
  .action(function (env) {
    console.warn('command not implemented:  "%s"', env);
    commander.outputHelp();
  });

commander.parse(process.argv);

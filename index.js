var chunkArray = require('./src/util/chunkArray');
var shuffleArray = require('./src/util/shuffleArray');
var grepit = require('./src/grepit');

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
  showBrowser: true,
  shuffleLinks: true,
  debug: true
});
var DEFAULT_GREPIT_OPTIONS = _.defaults({}, {
  outputDirectory: 'out',
  debug: DEFAULT_OPTIONS.debug,
  showBrowser: DEFAULT_OPTIONS.showBrowser
});

commander
  .version('0.0.1')
  .option('-v, --verbose', 'Display more fine grained log messages.')
  .option('-debug, --debug', 'Display more fine grained log messages.');

commander
  .command('download')
  .alias('start')
  .description('start downloading page contents to output directory')
  .option('-i, --input-directory [indir]', 'The directory where to load inputs from.', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'The directory where results are saved.', DEFAULT_OPTIONS.outputDirectory)
  .option('-i, --browser-instances [browser]', 'Number of browsers to use.', DEFAULT_OPTIONS.browserInstances)
  .option('-b, --show-browser [show]', 'Whether to show the browser window or run in headless mode.', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-links [shuffle]', 'Whether to shuffle input data before executing', DEFAULT_OPTIONS.shuffleLinks)
  .action(function (cmd, options) {


//split the read links on operating-specific newlines into an array
    var links = fs.readFileSync(cmd.inputDirectory)
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

    var calcChunkSize = (links) => {
      return links.length <= cmd.browserInstances ? links.length : Math.ceil(links.length / cmd.browserInstances);
    };

    var shuffledOrOrderedLinks = cmd.shuffleLinks ? shuffleArray(links) : links;
    var chunkedLinkLists = chunkArray(shuffledOrOrderedLinks, calcChunkSize(links));

    var runnables = chunkedLinkLists
      .map(links => grepit(links, _.defaults(cmd, DEFAULT_GREPIT_OPTIONS)));

    vo(runnables)
      .then(foo => console.log('done'))
      .catch(e => console.error(e));
  });

commander
  .command('*')
  .action(function (env) {
    console.log('deploying "%s"', env);
  });


commander.parse(process.argv);

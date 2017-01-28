var chunkArray = require('./src/util/chunkArray');
var shuffleArray = require('./src/util/shuffleArray');
var download = require('./src/download');

var fs = require('fs');
var path = require('path');
var vo = require('vo');
var os = require('os');
var _ = require('lodash');
var commander = require('commander');

var cpuCoresCount = os.cpus().length;

var DEFAULT_OPTIONS = _.defaults({}, {
  inputDirectory: 'examples',
  outputDirectory: 'out',
  browserInstances: Math.max(cpuCoresCount, 1),
  fetchTimeout: 10000,
  showBrowser: false,
  nojs: false,
  noimg: false,
  shuffleInput: false,
  debug: false,
  saveType: 'HTMLOnly',
  screenshot: false,
  randomUserAgent: false,
  pdf: false,
  html: true
});

commander
  .version('0.0.1')
  .option('-v, --verbose', 'display more fine grained log messages')
  .option('-debug, --debug', 'run in debug mode');

commander.command('help', null, {isDefault: true})
  .description('display help information')
  .action(function () {
    commander.outputHelp();
  });

commander
  .command('html')
  .description('download content as html')
  .option('-i, --input-directory [indir]', 'directory where to load inputs from', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'directory where results are saved', DEFAULT_OPTIONS.outputDirectory)
  .option('-n, --browser-instances [browser]', 'number of browsers to use', str => parseInt(str, 10), DEFAULT_OPTIONS.browserInstances)
  .option('-t, --fetch-timeout [timeout]', 'per page timeout in milliseconds', str => parseInt(str, 10), DEFAULT_OPTIONS.fetchTimeout)
  .option('-r, --randomize-useragent', 'randomize useragents', DEFAULT_OPTIONS.randomUserAgent)
  .option('-j, --nojs', 'disable javascript', DEFAULT_OPTIONS.nojs)
  .option('-N, --noimg', 'disable images', DEFAULT_OPTIONS.noimg)
  .option('-b, --show-browser', 'show browser window or run in headless mode', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-input', 'shuffle input data before executing', DEFAULT_OPTIONS.shuffleInput)
  .option('-T, --save-type [type]', 'type in which to persist html outputs', /^(HTMLOnly|HTMLComplete|MHTML)$/i, DEFAULT_OPTIONS.saveType)
  .action(function (cmd) {
    var options = _.defaults(cmd, DEFAULT_OPTIONS);
    options.html = true;
    options.screenshot = false;
    options.pdf = false;

    var runnables = download(options);

    vo(runnables)
      .then(foo => console.log('done'))
      .catch(e => console.error(e));
  });

commander
  .command('screenshot')
  .description('download content as image')
  .option('-i, --input-directory [indir]', 'directory where to load inputs from', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'directory where results are saved', DEFAULT_OPTIONS.outputDirectory)
  .option('-n, --browser-instances [browser]', 'number of browsers to use', str => parseInt(str, 10), DEFAULT_OPTIONS.browserInstances)
  .option('-t, --fetch-timeout [timeout]', 'per page timeout in milliseconds', str => parseInt(str, 10), DEFAULT_OPTIONS.fetchTimeout)
  .option('-r, --randomize-useragent', 'randomize useragents', DEFAULT_OPTIONS.randomUserAgent)
  .option('-j, --nojs', 'disable javascript', DEFAULT_OPTIONS.nojs)
  .option('-N, --noimg', 'disable images', DEFAULT_OPTIONS.noimg)
  .option('-b, --show-browser', 'show browser window or run in headless mode', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-input', 'shuffle input data before executing', DEFAULT_OPTIONS.shuffleInput)
  .action(function (cmd) {
    var options = _.defaults(cmd, DEFAULT_OPTIONS);
    options.html = false;
    options.screenshot = true;
    options.pdf = false;

    var runnables = download(options);

    vo(runnables)
      .then(foo => console.log('done'))
      .catch(e => console.error(e));
  });

commander
  .command('pdf')
  .description('download content as pdf')
  .option('-i, --input-directory [indir]', 'directory where to load inputs from', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'directory where results are saved', DEFAULT_OPTIONS.outputDirectory)
  .option('-n, --browser-instances [browser]', 'number of browsers to use', str => parseInt(str, 10), DEFAULT_OPTIONS.browserInstances)
  .option('-t, --fetch-timeout [timeout]', 'per page timeout in milliseconds', str => parseInt(str, 10), DEFAULT_OPTIONS.fetchTimeout)
  .option('-r, --randomize-useragent', 'randomize useragents', DEFAULT_OPTIONS.randomUserAgent)
  .option('-j, --nojs', 'disable javascript', DEFAULT_OPTIONS.nojs)
  .option('-N, --noimg', 'disable images', DEFAULT_OPTIONS.noimg)
  .option('-b, --show-browser', 'show browser window or run in headless mode', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-input', 'shuffle input data before executing', DEFAULT_OPTIONS.shuffleInput)
  .action(function (cmd) {
    var options = _.defaults(cmd, DEFAULT_OPTIONS);
    options.html = false;
    options.screenshot = false;
    options.pdf = true;

    var runnables = download(options);

    vo(runnables)
      .then(foo => console.log('done'))
      .catch(e => console.error(e));
  });

commander
  .command('download')
  .description('download content to output directory')
  .option('-i, --input-directory [indir]', 'directory where to load inputs from', DEFAULT_OPTIONS.inputDirectory)
  .option('-o, --output-directory [outdir]', 'directory where results are saved', DEFAULT_OPTIONS.outputDirectory)
  .option('-n, --browser-instances [browser]', 'number of browsers to use', str => parseInt(str, 10), DEFAULT_OPTIONS.browserInstances)
  .option('-t, --fetch-timeout [timeout]', 'per page timeout in milliseconds', str => parseInt(str, 10), DEFAULT_OPTIONS.fetchTimeout)
  .option('-r, --randomize-useragent', 'randomize useragents', DEFAULT_OPTIONS.randomUserAgent)
  .option('-j, --nojs', 'disable javascript', DEFAULT_OPTIONS.nojs)
  .option('-N, --noimg', 'disable images', DEFAULT_OPTIONS.noimg)
  .option('-b, --show-browser', 'show browser window or run in headless mode', DEFAULT_OPTIONS.showBrowser)
  .option('-s, --shuffle-input', 'shuffle input data before executing', DEFAULT_OPTIONS.shuffleInput)
  .option('-h, --html', 'save content as html', DEFAULT_OPTIONS.html)
  .option('-p, --pdf', 'create a pdf of the content', DEFAULT_OPTIONS.pdf)
  .option('-T, --save-type [type]', 'type in which to persist html outputs', /^(HTMLOnly|HTMLComplete|MHTML)$/i, DEFAULT_OPTIONS.saveType)
  .option('-x, --screenshot', 'take a screenshot of the content', DEFAULT_OPTIONS.screenshot)
  .action(function (cmd) {
    var options = _.defaults(cmd, DEFAULT_OPTIONS);

    var runnables = download(options);

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

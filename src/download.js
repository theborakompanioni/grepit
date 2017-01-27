var Nightmare1 = require('nightmare');
var fs = require('fs');
var path = require('path');
var URL = require('url');
var sanitizeFilename = require("sanitize-filename");
var mkdirp = require('mkdirp');
var _ = require('lodash');
var random_useragent = require('random-useragent');

var DEFAULT_OPTIONS = {
  outputDirectory: 'out',
  fetchTimeout: 10000/* in ms */,
  switches: {
    //'proxy-server': '1.2.3.4:5678',
    //'ignore-certificate-errors': true
  },
  showBrowser: false,
  debug: false,
  saveType: 'HTMLOnly',
  screenshot: false,
  pdf: false,
  html: true,
  viewport: {
    width: 1366,
    height: 768
  },
  userAgent: random_useragent.getRandom()
};


var parseAsUrls = function (links) {
  return (links || []).map(link => {
    /**
     * URL e.g.:
     * auth = null
     * hash = null
     * hostname = "www.google.com"
     * href = "http://www.google.com/?ts=a6762575"
     * path = "/?ts=a6762575"
     * pathname = "/"
     * port = null
     * protocol = "http:"
     * query = "ts=a6762575"
     * search = "?ts=a6762575"
     */
    return URL.parse(link);
  }).filter(link => !!link);
};

/**
 * grepit
 * Description
 *
 * @name grepit
 * @function
 * @param {Array} links An array of links
 * @param {Object} options An object containing the following fields:
 * - {String} outputDirectory
 * - {Number} fetchTimeout
 * - {Object} switches
 * - {Boolean} debug
 *
 * @return {function} Result
 */
module.exports = function (links, options) {
  var _links = parseAsUrls(links);

  var _options = _.defaults(options, DEFAULT_OPTIONS);

  var outputDirectory = sanitizeFilename(_options.outputDirectory);
  mkdirp.sync(outputDirectory);

  var nightmare = ((config) => {
    var val = null;
    return () => {
      if (val == null) {
        val = Nightmare1({
          gotoTimeout: config.fetchTimeout,
          show: config.showBrowser,
          switches: config.switches || {},
          openDevTools: !config.debug ? null : {
            mode: 'detach'
          }
        })
          .viewport(config.viewport.width, config.viewport.height)
          .useragent(config.userAgent);
      }
      return val;
    }
  })(_options);

  return function *() {
    //run the page HTML retrieval and save for each link
    for (var idx in _links) {
      var link = _links[idx];

      var hostOutputDirectory = path.resolve(outputDirectory, sanitizeFilename(link.host));
      mkdirp.sync(hostOutputDirectory);

      var filenameWithoutExtension = sanitizeFilename(link.href);

      var htmlFilename = filenameWithoutExtension + '.txt';
      var htmlOut = path.resolve(hostOutputDirectory, htmlFilename);

      var screenshotFilename = filenameWithoutExtension + '.png';
      var screenshotOut = path.resolve(hostOutputDirectory, screenshotFilename);

      var pdfFilename = filenameWithoutExtension + '.pdf';
      var pdfOut = path.resolve(hostOutputDirectory, pdfFilename);

      var fetchHtml = _options.html && !fs.existsSync(htmlOut);
      var fetchScreenshot = _options.screenshot && !fs.existsSync(screenshotOut);
      var fetchPdf = _options.pdf && !fs.existsSync(pdfOut);

      var contentFetchingNeeded = fetchHtml || fetchScreenshot || fetchPdf;
      if (!contentFetchingNeeded) {
        console.log('skipping ' + link.href + ' as it already exists.');
      } else {
        console.log('fetching ' + link.href);

        var page = nightmare().goto(link.href);

        if (fetchHtml) {
          page.html(htmlOut, _options.saveType);
        }
        if (fetchScreenshot) {
          page.screenshot(screenshotOut);
        }
        if (fetchPdf) {
          page.pdf(pdfOut);
        }

        yield page;

        console.log('successfully written files for ' + link.href);
      }
    }
    yield nightmare().end();
  };
};


var Nightmare1 = require('nightmare');
var fs = require('fs');
var URL = require('url');
var sanitizeFilename = require("sanitize-filename");
var mkdirp = require('mkdirp');
var _ = require('lodash');

var DEFAULT_OPTIONS = {
  outputDirectory: 'out'
};


var parseAsUrls = function (links) {
  return (links || []).map(link => {
    /**
     * URL e.g.:
     * auth = null
     * hash = null
     * hostname = "blog.fefe.de"
     * href = "http://blog.fefe.de/?ts=a6762575"
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
 *
 * @return {function} Result
 */

module.exports = function (links, options) {
  var _links = parseAsUrls(links);

  var _options = _.defaults(options, DEFAULT_OPTIONS);

  var outputDirectory = sanitizeFilename(_options.outputDirectory);
  mkdirp.sync(outputDirectory);

  var nightmare = Nightmare1({
    show: true,//false, // true
    switches: {
      //'proxy-server': '1.2.3.4:5678',
      //'ignore-certificate-errors': true
    },
    openDevTools: {
      //mode: 'detach'
    },
  })
    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36");

  return function *() {
    //run the page HTML retrieval and save for each link
    for (var idx in _links) {
      var link = _links[idx];

      var filename = sanitizeFilename(link.href + '.txt');
      var hostOutputDirectory = outputDirectory + '/' + sanitizeFilename(link.host);
      mkdirp.sync(hostOutputDirectory);

      var out = hostOutputDirectory + '/' + filename;

      if (fs.existsSync(out)) {
        console.log('skipping ' + link.href + ' as it already exists.');
      } else {
        console.log('fetching ' + link.href);

        var page = yield nightmare.goto(link.href)
          .pdf(out + '.pdf', 'HTMLOnly')
          .html(out, 'HTMLOnly');

        console.log('successfully written to file ' + out);
      }
    }
    yield nightmare.end();
  };
};

var Nightmare1 = require('nightmare');
var nightmare = Nightmare1({
  show: true, //false, // true
});
var fs = require('fs');
var URL = require('url');
var _ = require('lodash');

var DEFAULT_OPTIONS = {
  outputDirectory: 'out',
  querySelector: 'html'
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
  var _links = (links || []).map(link => {
    return URL.parse(link);
  }).filter(link => !!link);

  var _options = _.defaults(options, DEFAULT_OPTIONS);

  var querySelector = _options.querySelector;
  return function *() {
    //run the page HTML retrieval and save for each link
    for (var idx in _links) {
      var page = yield nightmare.goto(_links[idx].href)
        .evaluate(function (querySelector) {
          var html = document.querySelector(querySelector);
          if (!html) {
            return '## grepit: no ' + querySelector + ' tag found';
          }
          return html.innerHTML;
        }, querySelector);

      var filename = _links[idx].hostname + '.txt';
      var out = _options.outputDirectory + '/' + filename;
      fs.writeFileSync(out, page);
    }
    yield nightmare.end();
  };
};

var Nightmare1 = require('nightmare');
var nightmare = Nightmare1({
  show: true, //false, // true
});
var fs = require('fs');
var URL = require('url');
var _ = require('lodash');

/**
 * grepit
 * Description
 *
 * @name grepit
 * @function
 * @param {Array} data An array of data
 * @param {Object} options An object containing the following fields:
 *
 * @return {function} Result
 */

module.exports = function (links, options) {
  var _options = _.defaults(options, {
    outputDirectory: 'out'
  });

  return function *() {
    //run the page HTML retrieval and save for each link
    for (var ix in links) {
      var page = yield nightmare.goto(links[ix])
        .evaluate(function () {
          var body = document.querySelector('body');
          return body.innerHTML;
        });

      var url = URL.parse(links[ix]);
      var filename = url.hostname + '.txt';
      var out = _options.outputDirectory + '/' + filename;
      fs.writeFileSync(filename, page);

    }
    yield nightmare.end();
  };
};

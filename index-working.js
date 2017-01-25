var Nightmare1 = require('nightmare');
var nightmare = Nightmare1({
  show: true, //false, // true
});
var fs = require('fs');
var URL = require('url');
var vo = require('vo');
var SYSTEM_EOL = require('os').EOL;

var run = function *() {

  //split the read links on operating-specific newlines into an array
  var links = fs.readFileSync('links.txt')
    .toString()
    .split(SYSTEM_EOL);

  //filter out blank lines
  links = links.filter(function (link) {
    return !(/^\s*$/.test(link));
  });

  //run the page HTML retrieval and save for each link
  for (var ix in links) {
    var page = yield nightmare.goto(links[ix])
      .evaluate(function () {
        var body = document.querySelector('body');
        return body.innerHTML;
      });
    var filename = URL.parse(links[ix]).hostname + '.txt';
    fs.writeFileSync(filename, page);

  }
  yield nightmare.end();
};

vo(run)(function (err) {
  console.log('done');
});

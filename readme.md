# grepit
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> opinionated web content fetching with nightmarejs

## Install
Prerequisites:
- [git](https://git-scm.com/)
- [node](https://nodejs.org)

```
$ git clone https://github.com/theborakompanioni/grepit.git
$ cd grepit
$ npm install
```

## Usage

```
$ node grepit download \
  --input-directory my_input_dir \
  --output-directory my_output_directory \
  --browser-instances 4 \
  --fetch-timeout 10000 \
  --show-browser true \
  --shuffle-input true \
  --save-type HTMLOnly
```

```
$ node grepit --help

  Usage: grepit [options] [command]

  Commands:

    help                       display help information
    download [options]         start downloading page contents to output directory
    *

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -v, --verbose    display more fine grained log messages
    -debug, --debug  run in debug mod
```

```
$ node grepit download --help

  Usage: download|start [options]

  start downloading page contents to output directory

  Options:

    -h, --help                         output usage information
    -i, --input-directory [indir]      directory where to load inputs from
    -o, --output-directory [outdir]    directory where results are saved
    -i, --browser-instances [browser]  number of browsers to use
    -t, --fetch-timeout [timeout]      number of browsers to use
    -p, --pdf                          create a pdf of the content
    -T, --save-type [type]             type in which to persist outputs
    -x, --screenshot                   take a screenshot of the content
    -b, --show-browser                 show the browser window or run in headless mode
    -s, --shuffle-input                shuffle input data before executing

```

saveType String - Specify the save type.
- `HTMLOnly` - Save only the HTML of the page.
- `HTMLComplete` - Save complete-html page.
- `MHTML` - Save complete-html page as MHTML.
See [electron savetype info](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#webcontentssavepagefullpath-savetype-callback)


## Development
```
$ npm install --save theborakompanioni/grepit
```

```js
var grepit = require('grepit');

var download = grepit([
  'http://www.google.com'
]);

var gen = download();
var page = gen.next().value;

// ...
```


## License
MIT © [theborakompanioni](http://github.com/theborakompanioni)

[travis-url]: https://travis-ci.org/theborakompanioni/grepit
[travis-image]: https://img.shields.io/travis/theborakompanioni/grepit.svg?style=flat-square

[depstat-url]: https://david-dm.org/theborakompanioni/grepit
[depstat-image]: https://david-dm.org/theborakompanioni/grepit.svg?style=flat-square

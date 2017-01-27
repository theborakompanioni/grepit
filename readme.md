# grepit
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]

> persist web content

## Installation

```
$ npm install --save grepit
```

## Usage

```
$ node grepit download \
  --input-directory my_input_dir \
  --output-directory my_output_directory \
  --browser-instances 4 \
  --fetch-timeout 10000 \
  --show-browser true \
  --shuffle-links true
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
    -i, --input-directory [indir]      the directory where to load inputs from
    -o, --output-directory [outdir]    the directory where results are saved
    -i, --browser-instances [browser]  number of browsers to use
    -i, --fetch-timeout [timeout]      number of browsers to use
    -b, --show-browser [show]          whether to show the browser window or run in headless mode
    -s, --shuffle-links [shuffle]      whether to shuffle input data before executing

```

## Code
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

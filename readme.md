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
Place text files with URLs in a directory named "input_data" and run:
```
$ node grepit html -i input_data -o out -r -s -b
```

### help
```
$ node grepit --help

  Usage: grepit [options] [command]


  Commands:

    help                   display help information
    html [options]         download content as html
    screenshot [options]   download content as image
    pdf [options]          download content as pdf
    download [options]     download content to output directory
    *                    

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -v, --verbose    display more fine grained log messages
    -debug, --debug  run in debug mode

```

### html
```
$ node grepit html --help

  Usage: html [options]

  download content as html

  Options:

    -h, --help                         output usage information
    -i, --input-directory [indir]      directory where to load inputs from
    -o, --output-directory [outdir]    directory where results are saved
    -n, --browser-instances [browser]  number of browsers to use
    -t, --fetch-timeout [timeout]      per page timeout in milliseconds
    -r, --randomize-useragent          randomize useragents
    -b, --show-browser                 show browser window or run in headless mode
    -s, --shuffle-input                shuffle input data before executing
    -T, --save-type [type]             type in which to persist html outputs
    
```

saveType String - Specify the save type.
- `HTMLOnly` - Save only the HTML of the page.
- `HTMLComplete` - Save complete-html page.
- `MHTML` - Save complete-html page as MHTML.
See [electron savetype info](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#webcontentssavepagefullpath-savetype-callback)


### screenshot
```
$ node grepit screenshot --help
```

### pdf
```
$ node grepit pdf --help
```

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

[![Build Status](https://travis-ci.org/w3c/third-party-resources-checker.svg?branch=master)](https://travis-ci.org/w3c/third-party-resources-checker)
[![Coverage Status](https://coveralls.io/repos/w3c/third-party-resources-checker/badge.svg)](https://coveralls.io/r/w3c/third-party-resources-checker)

This phantomjs-based tool loads a Web-page and logs on the standard output any URL (one per line) the page requests while loading that is not a `www.w3.org` URL (as defined in the `whitelisted_domains` variable).

It is meant to become a component of a new streamlined W3C publication workflow.

## Installation

Install the dependencies by running `npm install`.

## Usage

### Standalone

The checker can be run standalone via the command line:

```shell
  Usage: third-party-resources-checker [options] URI

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -w, --whitelist <filename>  optional JSON file containing URIs and domains that are deemed OK

  Examples:

    $ third-party-resources-checker http://page.to.be/checked
    $ third-party-resources-checker -w whitelist.json http://page.to.be/checked

```

Sample whitelist file:
```
{
    "domains": [
        "www.foobar.org"
    ],
    "urls": [
        "http://example.org/image.jpg"
    ]
}
```

### As a module

The checker can also be run as a module. `require('third-party-resources-checker')` exposes a single `check` function:

```js
check(uri, [whitelist]);
```

It returns a `Promise` of a tuple (as a JavaScript `Array`):

- The first element is the exit code
- The second element is an `Array` of `String`, each of them being an external resource

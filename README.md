[![npm version](https://img.shields.io/npm/v/third-party-resources-checker.svg)](https://npmjs.org/package/third-party-resources-checker)
[![License](https://img.shields.io/npm/l/third-party-resources-checker.svg)](LICENSE)
[![Build Status](https://travis-ci.org/w3c/third-party-resources-checker.svg?branch=master)](https://travis-ci.org/w3c/third-party-resources-checker)
[![Coverage Status](https://coveralls.io/repos/w3c/third-party-resources-checker/badge.svg)](https://coveralls.io/r/w3c/third-party-resources-checker)
[![Dependency Status](https://david-dm.org/w3c/third-party-resources-checker.svg)](https://david-dm.org/w3c/third-party-resources-checker)
[![devDependency Status](https://david-dm.org/w3c/third-party-resources-checker/dev-status.svg)](https://david-dm.org/w3c/third-party-resources-checker#info=devDependencies)

# Third Party Resources Checker

This PhantomJS-based tool loads a given URL and logs on the standard output any URL (one per line) the page requests while loading that is not a `www.w3.org` nor a whitelisted URL (as defined in the `whitelisted_domains` variable).

It is a component of the W3C automated publication workflow, orchestrated by [Echidna](https://github.com/w3c/echidna).

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

### As a module

The checker can also be run as a module. `require('third-party-resources-checker')` exposes a single `check` function:

```js
check(uri, [whitelist]);
```

It returns a `Promise` of a tuple (as a JavaScript `Array`):

- The first element is the exit code
- The second element is an `Array` of `String`, each of them being an external resource


### Whitelist format

When used standalone, the whitelist must be written in a [JSON file](https://en.wikipedia.org/wiki/JSON). When used as a module, it must be given to the `check()` function as a [JavaScript object literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals). In both cases, its format is the following:

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

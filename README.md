This phantomjs-based tool loads a Web-page and logs on the standard output any URL (one per line) the page requests while loading that is not a `www.w3.org` URL (as defined in the `whitelisted_domains` variable).

It is meant to become a component of a new streamlined W3C publication workflow.

## Usage

After installing the dependencies with `npm install`, run the checker via the command line:

```shell
  Usage: third-party-resources-checker [options] URI

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -w, --whitelist <filename>  optional file containing URIs (one per line) that are deemed OK

  Examples:

    $ third-party-resources-checker http://page.to.be/checked
    $ third-party-resources-checker -w whitelist.txt http://page.to.be/checked

```

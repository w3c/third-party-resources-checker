This phantomjs-based tool loads a Web-page and logs on the standard output any URL (one per line) the page requests while loading that is not a `www.w3.org` URL (as defined in the `whitelisted_domains` variable).

It is meant to become a component of a new streamlined W3C publication workflow.

# Running

Start by installing the dependencies:

```shell
npm install
```

Then, on the command line, run:

```shell
phantomjs --ssl-protocol=tlsv1 detect-phantom.js http://example.org/page/to/be/checked [whitelist.txt]
```

or via npm:

```shell
npm start http://example.org/page/to/be/checked [whitelist.txt]
```

`whitelist.txt` is an optional file containing URIs (one per line) that are deemed OK.

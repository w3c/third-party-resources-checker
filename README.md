This phantomjs-based tool loads a Web-page and logs on the standard output any URL (one per line) the page requests while loading that is not a `www.w3.org` URL (as defined in the `whitelisted_domains` variable).

It is meant to become a component of a new streamlined W3C publication workflow.

# Running
```shell
phantomjs detect-phantom.js http://example.org/page/to/be/checked
```
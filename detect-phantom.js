var page = require('webpage').create()
,       fs = require('fs')
,	system = require('system')
,       urllib = require('url')
,	url = system.args[1]
,       whitelist_source = system.args[2]
;

console.error = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

if (url === undefined) {
    console.error('Missing URL as argument');
    phantom.exit(1);
}

var whitelisted_urls = [];
if (whitelist_source) {
    if (fs.exists(whitelist_source)) {
        var whitelist_content = fs.read(whitelist_source);
        whitelisted_urls = whitelist_content.split("\n");
    } else {
        console.log("The whitelist file doesn't exist");
    }
}

var whitelisted_domains = ["www.w3.org"];

var scheme = urllib.parse(url).protocol;
if (scheme !== 'http:' && scheme !== 'https:') {
    console.error('not allowed to load ' + url);
    phantom.exit(1);
}

var progress = 0;
var found = false;

//this function is loaded each time a resource is requested
page.onResourceRequested = function(requestData, networkRequest) {
    progress++;
    if (progress > 1) {
        // We would falsely report the first request if it is relative
        // such is life
        if (progress === 2) {
            page.evaluate(function() {
                var b = document.createElement("base");
                b.setAttribute("href", "http://staging/");
                document.getElementsByTagName("head")[0].appendChild(b);
            });
        }
        if (whitelisted_urls.indexOf(requestData.url) !== -1) {
            networkRequest.abort();
            return;
        }
        var parsedUrl = urllib.parse(requestData.url);
        if (parsedUrl.hostname === 'staging') {
            networkRequest.changeUrl(urllib.resolve(url, parsedUrl.path));
        }
        var domain = urllib.parse(requestData.url).hostname;
        if (whitelisted_domains.indexOf(domain) === -1 && domain !== "staging") {
            found = true;
            console.log(requestData.url);
            // let's save ourselves unnecessary efforts when testing
            if (domain === "example.org" || domain === "example.com") {
                networkRequest.abort();
            }
        } else {
            // we assume resources on whitelisted domains have already been vetted
            // and don't need to be checked for third-party resources
            if (domain !== "staging") {
                networkRequest.abort();
            }
        }
    }
};

page.open(url, function (status) {
    if (status !== 'success') {
        console.error('fail to load ' + url);
        phantom.exit(1);
    } else {
        if (!found) {
  	    phantom.exit(0);
        } else {
            phantom.exit(64);
        }
    }
});

phantom.onError = console.error;
page.onError = console.error;

var page = require('webpage').create()
,	system = require('system')
,       urllib = require('./node_modules/url/url.js')
,       querystring = require('./node_modules/querystring/index.js')
,	url = system.args[1]
;

var scheme = urllib.parse(url).protocol;
if (scheme !== 'http:' && scheme !== 'https:') {
    console.log('not allowed to load ' + url);
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
                b.setAttribute("href", "http://staging.w3.org/");
                document.getElementsByTagName("head")[0].appendChild(b);
            });
        }
        var parsedUrl = urllib.parse(requestData.url);
        if (parsedUrl.hostname === 'staging.w3.org') {
            networkRequest.changeUrl(urllib.resolve(url, parsedUrl.path));
        }
        var domain = urllib.parse(requestData.url).hostname;
        if (!domain.match(/w3\.org$/)) {
            found = true;
            console.log(requestData.url);
        }
    }
};

page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log('fail to load ' + url);
        phantom.exit(1);
    } else {
        if (!found) {
  	    phantom.exit(0);
        } else {
            phantom.exit(64);
        }
    }
});
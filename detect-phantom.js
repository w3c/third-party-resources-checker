var page = require('webpage').create()
,	system = require('system')
,       urlparse = require('./node_modules/wurl/wurl.js')
,	url = system.args[1]
;

var first = true;
var found = false;

//this function is loaded each time a resource is requested
page.onResourceRequested = function(requestData) {
    if (first) {
        first = false;
    } else {
        var domain = urlparse('domain', requestData.url);
        if (domain !== 'w3.org') {
            found = true;
            console.log(requestData.url);
        }
    }
};

page.open(system.args[1], function (status) {
    if (status !== 'success') {
        console.log('fail to load ' +system.args[1]);
        phantom.exit(1);
    } else {
        if (!found) {
  	    phantom.exit(0);
        } else {
            phantom.exit(64);
        }
    }
});
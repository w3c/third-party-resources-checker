var spawn = require('child_process').spawn;
var expect = require("expect.js");
var tests = [
    {"desc" : "find no non-w3.org resources",
     "input": "onlyw3org.html",
     "output": []},
    {"desc": "find one non-w3.org resource",
     "input": "one-nonw3org.html",
     "output": ["http://example.org/"]
    },
    {"desc": "find one non-w3.org resource loaded via XHR",
     "input": "xhr.html",
     "output": ["http://example.org/"]
    }
];

describe('Starting test suite', function() {
    var server = require("./server");
    var port = 3001;
    before(function() {
        server.start(port);
    });

    after(function() {
        server.close();
    });

    it("should fail to load a file", function (done) {
        var phantom = spawn('phantomjs', ['detect-phantom.js', 'file:///etc/passwd']);
        phantom.on('close', function(code) {
            expect(code).to.eql(1);
            done();
        });
    });

    tests.forEach(function(test) {
        it("should " + test.desc, function(done) {
            var phantom = spawn('phantomjs', ['detect-phantom.js', 'http://localhost:3001/' + test.input]);
            var buffer = "";
            phantom.stdout.on('data', function (data) {
                buffer += data;
            });
            phantom.on('close', function(code) {
                var consoleout = buffer.split("\n");
                consoleout.pop();
                expect(consoleout).to.eql(test.output);
                if (consoleout.length > 0) {
                    expect(code).to.eql(64);
                } else {
                    expect(code).to.eql(0);
                }
                done();
            });
        });
    });
});
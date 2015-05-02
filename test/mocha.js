var spawn = require('child_process').spawn;
var binPath = './bin/third-party-resources-checker';
var check = require('../lib/third-party-resources-checker').check;
var expect = require("expect.js");
var tests = [
    {"desc" : "find no non-w3.org resources",
     "input": "onlyw3org.html",
     "output": []},
    {"desc": "find one non-w3.org resource",
     "input": "one-nonw3org.html",
     "output": ["http://example.org/"]
    },
    {"desc": "find two non-w3.org resource",
     "input": "two-nonw3org.html",
     "output": ["http://example.org/", "http://example.com/"]
    },
    {"desc": "find one non-w3.org resource loaded via XHR",
     "input": "xhr.html",
     "output": ["http://example.org/"]
    },
    {"desc": "find one non-w3.org resource loaded via CSS",
     "input": "css.html",
     "output": ["http://example.org/"]
    },
    {"desc": "find one non-w3.org resource loaded via external CSS",
     "input": "external.html",
     "output": ["http://example.org/"]
    },
    {"desc": "work fine when relative is first and doc in a folder",
     "input": "folder",
     "output": ["http://example.org/"]
    },
    {"desc": "work fine when relative is first and doc in a folder with trailing slash",
     "input": "folder/",
     "output": ["http://example.org/"]
    },
    {"desc": "find one non-w3.org resource loaded after a failing script",
     "input": "js-error.html",
     "output": ["http://example.org/"]
    },
    {"desc": "ignores whitelisted 3rd party url",
     "whitelist": "test/whitelist.json",
     "input": "one-nonw3org.html",
     "output": []
    },
    {"desc": "ignores 3rd party resources under whitelisted domains",
     "whitelist": "test/whitelist.json",
     "input": "one-nonw3org-logo.html",
     "output": []
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

    it("should librarily fail to load a file", function (done) {
        check('file:///etc/passwd').then(function (result) {
            expect(result[0]).to.equal(1);
        }).done(done);
    });

    tests.forEach(function(test) {
        it("should librarily " + test.desc, function(done) {
            check('http://localhost:3001/' + test.input, test.whitelist)
                .then(function (result) {
                    expect(result[1]).to.eql(test.output);
                    if (result[1].length > 0) {
                        expect(result[0]).to.equal(64);
                    } else {
                        expect(result[0]).to.equal(0);
                    }
                }).done(done);
        });
    });

    it("should standalonely fail to load a file", function (done) {
        var program = spawn(binPath, ['file:///etc/passwd']);
        program.on('close', function(code) {
            expect(code).to.equal(1);
            done();
        });
    });

    tests.forEach(function(test) {
        it("should standalonely " + test.desc, function(done) {
            var args = ['http://localhost:3001/' + test.input];
            if (test.whitelist) {
                args.push('-w', test.whitelist);
            }
            var program = spawn(binPath, args);
            var buffer = "";
            program.stdout.on('data', function (data) {
                buffer += data;
            });
            program.on('close', function(code) {
                var consoleout = buffer.split("\n");
                consoleout.pop();
                expect(consoleout).to.eql(test.output);
                if (consoleout.length > 0) {
                    expect(code).to.equal(64);
                } else {
                    expect(code).to.equal(0);
                }
                done();
            });
        });
    });
});

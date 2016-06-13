'use strict';

var fs = require('fs');
var phantomPath = require('phantomjs-prebuilt').path || '/usr/local/bin/phantomjs';
var Promise = require('promise');
var script = fs.realpathSync(__dirname + '/detect-phantom.js');
var spawn = require('child_process').spawn;

exports.check = function check (uri, whitelist) {
    return new Promise(function (resolve, reject) {
        var args = [script, uri];
        if (whitelist) args.push(whitelist);

        var phantomjs = spawn(phantomPath, args);
        var buffer = '';

        phantomjs.stdout.on('data', function(data) { buffer += data; });

        phantomjs.on('exit', function(code){
            var stdout = buffer.split("\n");
            stdout.pop();
            resolve([code, stdout]);
        });
    });
}

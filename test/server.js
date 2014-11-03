var express = require('express'),
    app = express(),
    http = require('http').Server(app);

exports.start = function(port, path) {
    path = path || '/docs';
    path = __dirname + path;
    app.use(express.static(path));
    var serverport = port || 3001;
    http.listen(serverport);
};

exports.close = function() {
    http.close();
};

exports.start();
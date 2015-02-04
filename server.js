// requirements
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    apiServer = require('./apiServer'),
    fileServer = require('./fileServer');


function parseCookies (req) {
    console.log(req.headers.cookie);
}

module.exports = http.createServer(function (req, res) { ;
    var uri = url.parse(req.url).pathname,
        file = path.join(process.cwd(), uri);
    parseCookies(req);
    //route /api calls to api server
    if (uri.split('/')[1] === 'api') {
        apiServer(uri, req, res);
    } else {
    //route everything else to serve files
        fileServer(file, uri, req, res);
    }
});


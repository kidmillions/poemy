// requirements
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    models = require('./models'),
    apiServer = require('./apiServer'),
    fileServer = require('./fileServer');

module.exports =  http.createServer(function (req, res) { 
    var uri = url.parse(req.url).pathname,
        file = path.join(process.cwd(), uri);
    if (uri.split('/')[1] === 'api') {
        //if calls are made to the API then return restful json
        apiServer(req, res);
    } else {
        if (req.url === '/') {
            //serve index.html in /app if nothing
            file += 'app/index.html'
        }
        //callback optional
        fileServer(file, uri, req, res);
    }
});


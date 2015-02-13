// requirements
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    apiServer = require('./apiServer'),
    fileServer = require('./fileServer'),
    qs = require('querystring'),
    AM = require('./accountManager');


function parseCookies (req) {
    var cookiesArr = req.headers.cookie.split(';'),
        cookies = [];
    cookiesArr.forEach( function(cookie, i) {
        var pair = cookie.split('='),
            cookie_name = pair[0],
            cookie_value = pair[1]
        cookies[i] = {
            name : cookie_name,
            value : cookie_value
        };
    });
    return cookies;
}

function findCookie (name, cookies) {
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[0].name === name) {
            return true
            break;
        } else {
            return false
        }
    }
}

module.exports = http.createServer(function (req, res) { ;
    var uri = url.parse(req.url).pathname,
        file = path.join(process.cwd(), uri);
    //route /api calls to api server
    if (uri.split('/')[1] === 'api') {
        apiServer(uri, req, res);
    } else {
    //route everything else to serve files
        fileServer(file, uri, req, res);
    }
});

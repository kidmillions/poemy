var path = require('path'),
    fs = require('fs'),
    http = require('http'),
    url = require('url');

module.exports = function fileServer(file, uri, req, res, callback) {
    if (uri === '/') { 
        file += 'app/index.html'
    }
    var ext = path.extname(file),
        type = '';
        //var uri = url.parse(req.url).pathname,
        //    query = url.parse(req.url).query,
        //    filename = path.join(process.cwd(), uri);
        var fileExtensionTypes = {
            '.html' : 'text/html',
            '.css' : 'text/css',
            '.js' : 'text/javascript',
            '.json' : 'application/json',
            '.png' : 'image/png',
            '.jpg' : 'image/jpg',
            '.wav' : 'audio/wav',
            '.ico' : 'image/ico'
        };
        console.log('req: "'+uri+'" ext: '+ext);
        for(var i in fileExtensionTypes) {
            if(ext === i) { 
                type = fileExtensionTypes[i];
                break;
            }
        }
        fs.exists(file, function(exists) {
            if(!exists) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
                console.log('404 not found: '+uri);
                return;
            } else {
                res.writeHead(200, { 'Content-Type' : type });
                fs.createReadStream(file).pipe(res);
                console.log('served: "'+req.url+'" ext: '+ext+' type:'+type);
                if(callback !== undefined) callback();
            }
        });
}


var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    port = process.argv[2] || 3000;

http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);

    var contentTypesByExtension = {
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.js' : 'text/javascript'
    };

    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, 'binary', function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        });
    });
}).listen(port);

console.log('\034SERVER STARTED\034\n listening at\n => http://localhost:' + port+ "/\nCTRL + C to shutdown");



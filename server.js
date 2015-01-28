// requirements
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    models = require('./app/models'),
    config = require('./config'),
    port = process.argv[2] || 3000;

// database config
    dburl = config.localip + ':27017'
    mongoose.connect(dburl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('\nconnecting to mongodb at ' + dburl + '\n');
        //launch server only after successful database connection occurs
        launch();
    });

// launch server
function launch() { 
http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname,
        file = path.join(process.cwd(), uri);
    
    if(req.url === '/') {
        //server index.html in /app
        file += 'app/index.html'
    }
    
    //callback optional
    fileServer(file, req, res);
}).listen(port);

// file server
function fileServer(file, req, res, callback) {
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
        '.wav' : 'audio/wav'
    };

    console.log('req: "'+req.url+'" ext: '+ext);
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
            return;
        } else {
            res.writeHead(200, { 'Content-Type' : type });
            fs.createReadStream(file).pipe(res);
            console.log('served: "'+req.url+'" ext: '+ext+' type:'+type);
            if(callback !== undefined) callback();
        }
    });
}

console.log('\nSERVER STARTED\n listening at\n => http://localhost:' + port+ "/\nCTRL + C to shutdown");
}

//if (fs.statSync(filename).isDirectory()) filename += 'app/index.html';
//
//        fs.readFile(filename, 'binary', function(err, file) {
//                    if(err) {
//                                    res.writeHead(500, {"Content-Type": "text/plain"});
//                                                    res.write(err + "\n");
//                                                                    res.end();
//                                                                                    return;
//                                                                                                }
//
//                                                                                                            if (req.method === 'GET') {
//
//                                                                                                                            if (query === 'json') {
//
//                                                                                                                                                models.poem.find(function(err, poems) {
//                                                                                                                                                                        if (err) { res.send(err) }
//
//                                                                                                                                                                                                if (poems) {
//                                                                                                                                                                                                                            //res.writeHead(200, {'Content-Type': 'application/json'});
//                                                                                                                                                                                                                                                        res.write(JSON.stringify(poems));
//                                                                                                                                                                                                                                                                                    res.end();
//                                                                                                                                                                                                                                                                                                            } else {
//                                                                                                                                                                                                                                                                                                                                        res.end('nothing here');
//                                                                                                                                                                                                                                                                                                                                                                }
//                                                                                                                                                                                                                                                                                                                                                                                    });
//
//                                                                                                                                                                                                                                                                                                                                                                                                    } else {
//                                                                                                                                                                                                                                                                                                                                                                                                                        //res.writeHead(200, {'Content-Type': 'text/html'});
//                                                                                                                                                                                                                                                                                                                                                                                                                                            res.write(file, 'binary');
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                res.end();
//                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }

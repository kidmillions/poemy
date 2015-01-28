// requirements
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    models = require('./app/models'),
    config = require('./config'),
    //use 3000 or provided argument as in 'npm start 8080'
    port = process.argv[2] || 3000;

// database config
var dburl = config.localip + ':27017'
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
        console.log(req.url);
        if (uri.split('/')[1] === 'api') {
             //if calls are made to the API then return restful json
            restfulServer(req, res);
        } else {
            if (req.url === '/') {
                //serve index.html in /app if nothing
                file += 'app/index.html'
            }
            //callback optional
            fileServer(file, uri, req, res);
        }
    }).listen(port);
    console.log('\nSERVER STARTED\n listening at\n => http://localhost:' + port+ "/\nCTRL + C to shutdown");
}

//json dealer
function restfulServer(req, res, callback){
    if (req.url === '/api/poems') {
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        console.log('request made to api/poems');
        models.poem.find(function (err, poems) {
            if (err) return console.error(err);
            console.log('requested poems\n' + poems);
            res.write(JSON.stringify(poems));
            res.end();
        });
        } else {
        console.log('');
        res.end('nothing there');
    }
    if(callback !== undefined) callback();
}

// file server
function fileServer(file, uri, req, res, callback) {
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

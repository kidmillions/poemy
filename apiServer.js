var models = require('./models'),
    http = require('http');

module.exports = function apiServer(req, res, callback) {

}

//    pathArray = req.url.split('/');
//        if (req.url === '/api/poems') {
//                res.writeHead(200, { 'Content-Type' : 'application/json' });
//                        console.log('request made to api/poems');
//                                models.poem.find(function (err, poems) {
//                                            if (err) return console.error(err);
//                                                        // console.log('requested poems\n' + poems);
//                                                                    res.write(JSON.stringify(poems));
//                                                                                res.end();
//                                                                                        });
//                                                                                            } else if ( req.url ===  '/api/random_poem') {
//                                                                                                    res.writeHead(200, { 'Content-Type' : 'application/json' });
//                                                                                                            console.log('request made to api/random_poem');
//                                                                                                                    models.poem.findOneRandom(function (err, poem) {
//                                                                                                                                if (err) return console.error(err);
//                                                                                                                                            res.write(JSON.stringify(poem));
//                                                                                                                                                        res.end();
//                                                                                                                                                                });
//                                                                                                                                                                    } else if ( pathArray[2] === 'poem' ) {
//                                                                                                                                                                            if ( pathArray[3] === undefined) { console.log('acessed api/poem, but didn\'t provide id like: /api/poem/id ') }
//                                                                                                                                                                                    models.poem.findOne({ '_id' : pathArray[3] }).exec(function (err, poem) {
//                                                                                                                                                                                                if (err) return console.error(err);
//                                                                                                                                                                                                            res.write(JSON.stringify(poem));
//                                                                                                                                                                                                                        res.end();
//                                                                                                                                                                                                                                });
//
//                                                                                                                                                                                                                                        console.log('trying to find id = ' + pathArray[3]);
//                                                                                                                                                                                                                                            } else {
//                                                                                                                                                                                                                                                    res.writeHead(404);
//                                                                                                                                                                                                                                                            res.end('nothing here');
//                                                                                                                                                                                                                                                                }
//
//                                                                                                                                                                                                                                                                    if(callback !== undefined) callback();
//                                                                                                                                                                                                                                                                    }

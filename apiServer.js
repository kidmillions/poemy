var models = require('./models'),
    http = require('http');

module.exports = function apiServer(uri, req, res, callback) {
    
    //Good Request! Will be served!
    function goodRes (poem_data) {
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.write(JSON.stringify(poem_data));
        res.end();
    }

    //Bad Request! Bad Bad Bad!
    function badRes (err) {
        res.writeHead(404);
        res.end();
        console.log('404');
        console.error(err);
    }

    var pathArray = uri.split('/');
    
    if (pathArray === undefined) { badRes(new Error('the api shouldn\'t have been routed this bad request, undefined')) }
    
    switch (pathArray[2]) {
        // find all poems
        case 'poems':
            models.poem.find(function (err, poems) {
                if (err) return badRes(err);
                console.log('served req for poems');
                goodRes(poems);
            });
            break;
        //find one random poem
        case 'random_poem':
            models.poem.findOneRandom(function (err, poem) {
                if (err) return badRes(err);
                console.log('serverd req for random poem');
                goodRes(poem);
            });
            break;
        //find a poem with its ID
        case 'poem':
            var id = pathArray[3];
            if (id === undefined) { badRes(new Error('asked for single poem, but didn\'t provide ID like poem/ID')) }
            models.poem.findOne({ '_id' : id }).exec( function (err, poem) {
                if (err) return badRes(err);
                console.log('served req for poem with id: ' + id );
                goodRes(poem);
            });
            break;
        default:
            badRes(new Error('API could not return a because task value in url didn\'t match to a proper API call \(ie api/poems \)'));
            break;
    }
}

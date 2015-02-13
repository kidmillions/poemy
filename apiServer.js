var models = require('./models'),
    http = require('http'),
    AM = require('./accountManager');

module.exports = function apiServer(uri, req, res, callback) {

    //Good Request! Will be served!
    function goodRes (poem_data, code, report) {
      if (code === undefined) code = 200;
      if (report) console.log(report);
      res.writeHead(code, {
          'Set-Cookie' : 'username=kenny',
          'Content-Type' : 'application/json'
      });
      res.write(JSON.stringify(poem_data));
      res.end();
    }

    //Bad Request! Bad Bad Bad!
    function badRes (err, code) {
      if (code === undefined) code = 404
        res.writeHead(code);
        res.end();
        console.log(code);
        console.error(err);
    }

    function AuthService (accountManagementFunction) {
      if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
          body += data;
          //end connection if floody or bad connection
          if (body.length > 1e6) return badReq('Request Entity Too Large', 413);
        });
        req.on('end', function () {
          var POST = JSON.parse(body);
          accountManagementFunction(POST, function(err, user, message) {
            if (err) return badRes(err);
            goodRes(user, 200, user.name + ': ' + message);
          });
        });
      } else {
        badRes('Method Not Allowed', 405);
      }
    }

    var pathArray = uri.split('/');

    //toss bad calls to undefined routes
    if (pathArray === undefined) return badRes(new Error('the api shouldn\'t have been routed this bad request, undefined'));

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
            if (id === undefined) {
                badRes(new Error('asked for single poem, but didn\'t provide ID like poem/ID'))
                break;
            }
            models.poem.findOne({ '_id' : id }).exec( function (err, poem) {
                if (err) return badRes(err);
                console.log('served req for poem with id: ' + id );
                goodRes(poem);
            });
            break;
        //find all users
        case 'users':
            AM.getAllRecords( function(err, users) {
                if (err) return badRes(err);
                console.log('served req for all users');
                goodRes(users);
            });
            break;
        case 'username-exists':
            var nameToFind = pathArray[3];
            if ((nameToFind === undefined) || (nameToFind === null) || (nameToFind === '')) {
                badRes('asked for invalid name to validate');
                break;
            }
            AM.usernameExists( nameToFind, function(err, exists) {
                if (err) return badRes(err);
                goodRes(exists);
                console.log('served req for does username exist?: ' + nameToFind + ': ' + exists);
            });
            break;
        case 'email-exists':
            var emailToFind = pathArray[3];
            if ((emailToFind === undefined) || (emailToFind === null) || (emailToFind === '')){
                badRes('asked for invalid email to validate');
                break;
            }
            AM.emailExists( emailToFind, function(err, exists) {
                if(err) return badRes(err);
                goodRes(exists);
                console.log('served rq for does username exist?L ' + emailToFind + ': ' + exists);
            });
            break;
        case 'login':
            AuthService( AM.manualLogin );
            break;
        case 'signup':
            AuthService( AM.addNewAccount );
            break;
        default:
            badRes(new Error('API could not return a because task value in url didn\'t match to a proper API call \(ie api/poems \)'));
            break;
    }
}

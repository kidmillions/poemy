var server = require('../server'),
    config = require('../config'),
    dbConnect = require('../connectDatabase'),
    Chance = require('chance'),
    AM = require('../accountManager');

var chance = new Chance();

dbConnect( config.databaseUrl );
server.listen( config.port, console.log('server on'));

var user_name = chance.name(),
    user_email = chance.email(),
    user_pass = chance.string();

var newGuy = {
    name : user_name,
    email : user_email,
    pass : user_pass
}

AM.addNewAccount(newGuy, function(err, user) {
    if (err) return console.log(err);
    console.log('saved: '+ user.name);
});

AM.getAllRecords( function(err, users) {
    if (err) return console.log(err);
    if (users.length < 1) return console.log('nothing found');
    console.log(users);
    //AM.delAllRecords(function(err) {
    //    if (err) return console.log(err);
    //    console.log('removed');
    //});
});

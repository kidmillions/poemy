var server = require('../server'),
    config = require('../config'),
    dbConnect = require('../connectDatabase');
    AM = require('../accountManager');

//dbConnect( config.databaseUrl );
//server.listen( config.port, console.log('server on'));

AM.getAllRecords( function(err, users) {
    if (err) return console.log(err);
    console.log(users);
    AM.delAllRecords(function(err) {
        if (err) return console.log(err);
        console.log('removed');
    });
});

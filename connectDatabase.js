var mongoose = require('mongoose');

module.exports = function ( databaseUrl, callback ) {
    mongoose.connect( databaseUrl );
    var db = mongoose.connection;
    db.on('error', function (callback) {
        if (callback !== undefined) { callback('Couldn\'t make database connection') }
        console.error.bind(console, 'connection error:');
    });
    db.once('open', function (callback) {
        if (callback !== undefined) { callback(null); }
        console.log('\nconnecting to mongodb at ' + databaseUrl + '\n');
    });
}

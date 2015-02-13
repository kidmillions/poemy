var config = require('./config'),
    server = require('./server'),
    DM = require('./databaseManager');

DM.connect( config.databaseUrl);
server.listen( config.port, console.log('\nSERVER STARTED\n listening at\n => http://localhost:' + config.port+ "/\nCTRL + C to shutdown") );

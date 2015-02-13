var config = require('./config'),
    server = require('./server'),
    DM = require('./databaseManager'),
    AM = require('./accountManager')

DM.connect( config.databaseUrl);
AM.delAllRecords(function (err) {
  if (!err) return console.log('deleted users');
  console.log(err);
});

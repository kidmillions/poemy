var config = require('./config'),
    server = require('./server'),
    DM = require('./databaseManager'),
    AM = require('./accountManager'),
    models = require('./models');

DM.connect( config.databaseUrl);
AM.delAllRecords(function (err) {
  if (!err) return console.log('deleted users');
  console.log(err);
});

models.poem.remove({}, function(err) {
    if (err) return console.log(err);
    console.log('poems removed');
});

models.line.remove({}, function(err) {
    if (err) return console.log(err);
    console.log('lines removed');
});

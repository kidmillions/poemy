mongoose = require('mongoose'),
models = require('./app/models');
config = require('./config.js');
dburl = config.localip + ':27017'

mongoose.connect(dburl);

models.poem.find(function (err, poems) {
    if (err) {return console.error(err)}
    console.log(poems);
    return;
});

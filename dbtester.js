mongoose = require('mongoose'),
models = require('./app/models');
config = require('./config.js');
dburl = config.localip + ':27017';
http = require('http');

mongoose.connect(dburl);

models.poem.find(function (err, poems) {
    if (err) {return console.error(err)}
    console.log(poems);
    return;
});

function testApi() { 
    http.get(config.localip + ':3000/api/poems', function(res) {
        console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}


testApi();

var qs = require('querystring'),
    http = require('http'),
    fs = require('fs');

var post_data = JSON.stringify({
    name: 'Kenny!!!',
    email: 'lol@lol.com',
    pass: 'somethingsecret'
});

var post_options = {
    host: '192.168.1.52',
    port: '3000',
    path: '/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': post_data.length
    }
};

var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf-8');
    
    var responseString = '';

    res.on('data', function (chunk) {
        responseString += data;
    });
    res.on('end', function() {
        var resultObject = JSON.parse(responseString); 
    });
});

post_req.on('error', function(err) {
    console.log('OH NOES');
});

post_req.write(post_data);
post_req.end();

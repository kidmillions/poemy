var qs = require('querystring'),
    http = require('http'),
    fs = require('fs');

var post_data = JSON.stringify({
    name: 'Kenny!!!',
    email: 'lol@lol.com',
    pass: 'somethingsecret'
});

var post_options = {
    host: '192.168.1.100',
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
        responseString += chunk;
    });
    res.on('end', function() {
        console.log(res.body);
        var resultObject = JSON.parse(responseString); 
    });
});

post_req.on('error', function(err) {
    console.error(err);
});

post_req.write(post_data);
post_req.end();

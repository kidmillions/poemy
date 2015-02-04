var config = require('./config'),
    email = require('emailjs'),
    emailer = {};

module.exports = emailer;

emailer.server = email.server.connect({
    host: config.email.host,
    user: config.email.user,
    password: config.email.password,
    ssl: config.email.ssl,
    tls: config.email.tls,
    port: config.email.port
});

var message = {
        from: config.email.sender,
        to: 'hello@kennethpirman.com',
        subject: 'Password Reset',
        text: 'I hope this works',
        attachment: 
        [
            { data:'<html>i <i>hope</i> this works!</html>', alternative:true }
        ]
};

emailer.server.send(message, function(err, message) {
    console.log(err || message);
});


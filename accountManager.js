var models = require('./models'),
    bcrypt = require('bcrypt'),
    moment = require('moment'),
    accounts = models.user;

//Login Validations
exports.autoLogin = function(name, pass, callback) {
    accounts.findOne({name : name}, function(err, user) {
        if (err) return callback(err);
        if (user) {
            user.pass == pass ? callback(null, user) : callback('user found, password did not match', null);
        } else {
            callback('no user found', null);
        }
    });
}

exports.manualLogin = function(credentials, callback) {
    var name = credentials.name;
    var pass = credentials.pass;
    accounts.findOne({name:name}, function(err, user) {
        if (err) return callback(err);
        if (user == null) return callback('user-not-found');
        bcrypt.compare(pass, user.pass, function(err, res) {
            if (res) return callback(null, user, 'login');
            callback(new Error('invalid-password'));
        });
    });
}

// add new account, update and delete
exports.addNewAccount = function(newData, callback) {
    accounts.findOne({name : newData.name}, function(err, user) {
        if (user) return callback('user name taken');
        accounts.findOne({email : newData.email}, function(err, user) {
            if (user) return callback('email already in use');
            bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newData.pass, salt, function(err, hash) {
                newData.pass = hash;
                //native mongoose date saved in model automatically
                //newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                newData.role = 'editor';
                var newUser = new accounts(newData);
                    newUser.save(function (err, newUser) {
                        if (err) return callback(err);
                        callback(null, newUser, 'signup');
                        });
                    });
                });
            });
    });
}

//exports.updateAccount = function(newData, callback) {
 //   accounts.findOne({user:newData.user}

exports.usernameExists = function(nameToFind, callback) {
    accounts.findOne({ name : nameToFind }, function (err, user) {
        if (err) return callback(err)
        if (user === null) return callback(null, false)
        callback(null, true);
    });
}

exports.emailExists = function(emailToFind, callback) {
    accounts.findOne({ email : emailToFind }, function (err, user) {
        if (err) return callback(err)
        if (user === null) return callback(null, false)
        callback(null, true);
    });
}

//account lookup helpers
exports.getAllRecords = function(callback) {
    accounts.find(function (err, users) {
        if (err) return callback(err);
        callback(null, users);
    });
}

exports.delAllRecords = function(callback) {
    accounts.remove({}, function(err) {
        if (err) return callback(err);
        callback(null);
    });
}

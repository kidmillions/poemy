var models = require('./models'),
    bcrypt = require('bcrypt'),
    moment = require('moment'),
    accounts = models.user;

//Login Validations
exports.autoLogin = function(user, pass, callback) {
    accounts.findOne({user:user}, function(err, user) {
        if (user) {
            user.pass == pass ? callback(user) : callback(null);
        } else {
            callback(null);
        }
    });
}

exports.manualLogin = function(user, pass, callback) {
    accounts.findOne({user:user}, function(err, user) {
        if (user == null) return callback(new Error('user not found'));
        bcrypt.compare(pass, user.pass, function(err, res) {
            if (res) return callback(null, user);
                callback(new Error('invalid password'));
            });
    });
}

// add new account, update and delete
exports.addNewAccount = function(newData, callback) {
    accounts.findOne({user : newData}, function(err, user) {
        if (user) return callback(new Error('user name taken'));
        accounts.findOne({email : newData.email}, function(err, user) {
            if (user) return callback(new Error('email already in use'));
            bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newData.pass, salt, function(err, hash) {
                newData.pass = hash;
                newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                var newUser = new accounts(newData);
                    newUser.save(function (err, newUser) {
                        if (err) return callback(err);
                        callback(null);
                        });
                    });
                });
            });
    });
}

//exports.updateAccount = function(newData, callback) {
 //   accounts.findOne({user:newData.user}

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

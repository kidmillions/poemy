var mongoose = require('mongoose'),
    random = require('mongoose-simple-random');

//schema
var poemSchema = mongoose.Schema({
    title: String,
    type: String,
    lines: [String],
    complete: Boolean
});

var userSchema = mongoose.Schema({
    name: String, 
    email: String,
    //saved in database as a hash
    pass: String
});

//midware
poemSchema.plugin(random);

//export
var Poem = mongoose.model('Poem', poemSchema);
var User = mongoose.model('User', userSchema);
module.exports.poem = Poem;
module.exports.user = User;

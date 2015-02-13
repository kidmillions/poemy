var mongoose = require('mongoose'),
    random = require('mongoose-simple-random');

//schema
var poemSchema = mongoose.Schema({
    title: { type: String, default: 'untitled' },
    type: String,
    lines: [{ type: String, ref: 'Line'}],
    complete: Boolean,
    updated : { type: Date, default: Date.now }
});

var lineSchema = mongoose.Schema({
    poem: { type: String, ref: 'Poem' },
    content: String,
    _creator: { type: String, ref: 'User' },
    date : { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    //saved in database as a hash
    pass: String,
    role : String,
    date : { type: Date, default: Date.now },
    contributions : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Line'}]
});

//midware
poemSchema.plugin(random);

//export
var Line = mongoose.model('Line', lineSchema),
    Poem = mongoose.model('Poem', poemSchema),
    User = mongoose.model('User', userSchema);
module.exports.poem = Poem;
module.exports.user = User;
module.exports.line = Line;

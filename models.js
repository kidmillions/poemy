var mongoose = require('mongoose'),
    random = require('mongoose-simple-random');

//schema
var poemSchema = mongoose.Schema({
    title: { type: String, default: 'untitled' },
    type: { type: String, default: 'haiku' },
    complete: Boolean,
    updated : { type: Date, default: Date.now },

    //cashed values of lines
    lines: [
      {
        content: { type: String },
        creator: { type: String }
      }
    ]
});

//var lineSchema = mongoose.Schema({
//    poem: { type: String, ref: 'Poem' },
//    content: String,
//    _creator: { type: String, ref: 'User' },
//    date : { type: Date, default: Date.now }
//});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    //saved in database as a hash
    pass: String,
    role : String,
    pic : String,
    date : { type: Date, default: Date.now },
    contributions : [
      {
        poem: { type: String, ref: 'Poem' },

        //cashed values of contributions
        poem_title: { type: String },
        line_content: { type: String }
      }
    ]
});

//midware
poemSchema.plugin(random);

//export
var //Line = mongoose.model('Line', lineSchema),
    Poem = mongoose.model('Poem', poemSchema),
    User = mongoose.model('User', userSchema);
module.exports.poem = Poem;
module.exports.user = User;
//module.exports.line = Line;

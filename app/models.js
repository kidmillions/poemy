var mongoose = require('mongoose'),
    random = require('mongoose-simple-random');

var poemSchema = mongoose.Schema({
    title: String,
    type: String,
    lines: [String],
    complete: Boolean
});

poemSchema.plugin(random);


var Poem = mongoose.model('Poem', poemSchema);

module.exports.poem = Poem;

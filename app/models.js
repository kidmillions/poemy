var mongoose = require('mongoose');

var poemSchema = mongoose.Schema({
    title: String,
    type: String,
    lines: [String],
    complete: Boolean
})

var Poem = mongoose.model('Poem', poemSchema)

module.exports.poem = Poem;

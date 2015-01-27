var mongoose = require('mongoose');

var poemSchema = mongoose.Schema({
    title: String,
    type: String
})

var Poem = mongoose.model('Poem', poemSchema)

module.exports.poem = Poem;

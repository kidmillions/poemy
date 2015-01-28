var mongoose = require('mongoose'),
    models = require('./app/models'),
    config = require('./config');

dburl = config.localip + ':27017'

mongoose.connect(dburl);

var samplePoems = [{
    title: "Sample Poem",
    type: "Haiku",
    lines: ["this is a first line,", "But the second is best,", "and the third is last."],
    complete: true
    }, {
    title: "Poem 2",
    type: "Haiku",
    lines: ['An old silent pond...', 'A frog jumps into the pond'],
    complete: false
    }, {
    title: "Poem 3",
    type: "Haiku",
    lines: ["Light of the moon"],
    complete: false
    }, {
    title: "Poem 4  ",
    type: "Haiku",
    lines: ["A cricket disturbed", "the sleeping child; on the porch", "a man smoked and smiled."],
    complete: true
}];

samplePoems.forEach(function(sample) {
    var p = new models.poem;
    p.title = sample.title;
    p.type = sample.type;
    p.lines = sample.lines;
    p.complete = sample.complete;
    p.save(console.log('created' + sample.title));
});


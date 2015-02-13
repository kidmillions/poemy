var models = require('./models'),
    account = models.user,
    poem = models.poem,
    line = models.line;

exports.addNewPoem = function(newData, callback) {
    var newPoem = new poem(newData);
    newPoem.save(function (err, newPoem) {
      if (err) return callback(err);
      console.log(newPoem);
      callback(null, newPoem, 'new poem');
    });
}


exports.addNewLine = function(newData, callback) {
    var newLine = new line(newData);
    //save line
    newLine.save(function (err, newLine) {
      if (err) return callback(err);
      console.log(newLine);
      callback(null, newLine, 'new line');
    });
    //update poem
    poem.findOne({'_id' : newData.poem}, function (err, updated_poem) {
      if (err) return console.log(err);
      console.log(updated_poem);
      console.log('id thing' + newLine._id);
      //updated_poem.lines
      updated_poem.lines.push(newLine._id);
      updated_poem.save(updated_poem, {safe: true}, function(err){
        if (err) return console.log(err);
        console.log('poem updated');
      });
    });
}

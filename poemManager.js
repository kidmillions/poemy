var models = require('./models'),
    account = models.user,
    poem = models.poem,
    user = models.user;

exports.addNewPoem = function(newData, callback) {
    var newPoem = new poem(newData);
    newPoem.save(function (err, newPoem) {
      if (err) return callback(err);
      console.log(newPoem);
      callback(null, newPoem, 'new poem');
    });
}


exports.addNewLine = function(newLine, callback) {

    // newLine OBJECT STLYE
    // {
    //    poem: 'string of poem._id',
    //    content: 'string of content',
    //    username: 'string name',
    //    title: 'string title',
    //  }
    //

    if (newLine.username === null) {
      newLine.username = 'Anonymous';
    }

    var line = {
      content : newLine.content,
      creator : newLine.username
    }

    var contribution = {
      poem : newLine.poem,
      poem_title : newLine.title,
      line_content : newLine.content
    }

    poem.findOne({'_id' : newLine.poem}, function (err, updated_poem) {
      if (err) return console.log(err);
      console.log(updated_poem);
      updated_poem.lines.push(line);
      updated_poem.save(updated_poem, {safe: true}, function(err){
        if (err) return console.log(err);
        console.log(newLine.title + ' updated: "' + newLine.content + '"' );
      });
    });

    user.findOne({'name' : newLine.username }, function (err, updated_user) {
      if (updated_user == null) return console.log('no user of this name, posting annnonymously');
      if (err) return console.log(err);
      console.log(updated_user);
      updated_user.contributions.push(contribution);
      updated_user.save(updated_user, {safe: true}, function(err) {
        if(err) return console.log(err);
        console.log('contribution saved for ' + updated_user.name );
      });
    });

}

var mongoose = require('mongoose');
var User = require('./models/user.js');

var Keo = (function() {
  function Keo(_slack) {
    this._slack = _slack;
  }

  var add_virao = function(channel, winner){
    User.findOrCreate({ user: winner }, function(err, user, created) {
      user.viraos = user.viraos + 1;
      user.save();
      console.log('A new user from "%s" was inserted', user.user);
    });
    var response = "Un virao para " + winner;
    channel.send(response);
    return response;
  }

  var virao_list = function(channel){
    User.find({}, 'user viraos', function(err, users) {
      var response = "Lista de los viraos:";
      console.log(users);
      for (var i = 0;i<users.length;i++){
        console.log(users[i].user + " tiene " + users[i].viraos);
        response += "\n" + users[i].user + " tiene " + users[i].viraos;

      }
      channel.send(response);
    });
  }

  Keo.prototype.connect = function() {
    var unreads = this._slack.getUnreadCount();
    console.log("Welcome to Slack. You are @" + this._slack.self.name + " of " + this._slack.team.name);
    messages = unreads === 1 ? 'message' : 'messages';
    return console.log("You have " + unreads + " unread " + messages);
  }

  Keo.prototype.processMessage = function(message){

    var type = message.type, text = message.text;
    var channel = this._slack.getChannelGroupOrDMByID(message.channel);

    if (type === 'message' && (text != null) && (channel != null)) {
      var re = /<.*?>/g;
      var mentions = text.match(re);

      if(mentions && mentions[0].indexOf(this._slack.self.id) != -1 && text.indexOf('virao') != -1){
        if(mentions.length == 1){
          return virao_list(channel)
        } else if(mentions.length > 1){
          var response = add_virao(channel, mentions[1])
          return console.log("@" + this._slack.self.name + " responded with \"" + response + "\"");
        }
      }

    } else {
      var typeError = type !== 'message' ? "unexpected type " + type + "." : null;
      var textError = text == null ? 'text was undefined.' : null;
      var channelError = channel == null ? 'channel was undefined.' : null;
      var errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      return console.log("@" + this._slack.self.name + " could not respond. " + errors);
    }

  }

  return Keo;

})();

module.exports = Keo;

const mongoose = require('mongoose');
const User = require('./models/user.js');
const i18n = require('i18n');

const KudosBot = (function() {
  function KudosBot(_slack) {
    this._slack = _slack;
  }

  function addKudos(channel, winner){
    User.findOrCreate({ user: winner }, function(err, user, created) {
      user.kudos = user.kudos + 1;
      user.save();
    });
    const response = i18n.__('%s to %s', process.env.KUDOS_WORD, winner);
    channel.send(response);
    return response;
  }

  function kudosList(channel){
    User.find({}, 'user kudos', function(err, users) {
      var response = i18n.__('%s List', process.env.KUDOS_WORD);
      for (var i = 0;i<users.length;i++){
        response += "\n" + i18n.__('%s has %d %s', users[i].user, users[i].kudos, process.env.KUDOS_WORD);
      }
      channel.send(response);
    });
  }

  KudosBot.prototype.connect = function() {
    var unreads = this._slack.getUnreadCount();
    console.log("Welcome to Slack. You are @" + this._slack.self.name + " of " + this._slack.team.name);
    messages = unreads === 1 ? 'message' : 'messages';
    return console.log("You have " + unreads + " unread " + messages);
  }

  KudosBot.prototype.processMessage = function(message){

    var type = message.type, text = message.text;
    var channel = this._slack.getChannelGroupOrDMByID(message.channel);

    if (type === 'message' && (text != null) && (channel != null)) {
      var re = /<.*?>/g;
      var mentions = text.match(re);
      if(mentions && mentions[0].indexOf(this._slack.self.id) != -1 && text.indexOf(process.env.KUDOS_WORD) != -1){
        if(mentions.length == 1){
          return kudosList(channel)
        } else if(mentions.length > 1){
          var response = addKudos(channel, mentions[1])
          return console.log("@" + this._slack.self.name + " responded with \"" + response + "\"");
        }
      }

    } else {
      var typeError = "unexpected type " + type + ".";
      var textError = text == null ? 'text was undefined.' : null;
      var channelError = channel == null ? 'channel was undefined.' : null;
      var errors = [typeError, textError, channelError].filter(function(element) {
        return element !== null;
      }).join(' ');
      return console.log("@" + this._slack.self.name + " could not respond. " + errors);
    }

  }

  return KudosBot;
})();

module.exports = KudosBot;

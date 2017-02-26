'use strict';

const User = require('./models/user.js');
const i18n = require('i18n');

const KudosBot = {
  /**
   * Init bot instance
   * @param _slack slack connection instance
   * @param _keyword keyword for kudos
   */
  initBot(_slack, _keyword) {
    this.slack = _slack;
    this.keyword = _keyword
  },
  /**
   * Find or create winner user by id and count kudos
   * @param channel channel id
   * @param winner user id
   */
  addKudos(channel, winner){
    return User.findOrCreate({ user: winner }, (err, user, _created) => {
      user.kudos = user.kudos + 1;
      user.save();
      const response = i18n.__('%s to %s', this.keyword, winner);
      channel.send(response);
    });
  },
  /**
   * List all users with their current kudos count
   * @param channel channel id
   */
  kudosList(channel){
    User.find({}, 'user kudos', (err, users) => {
      let response = i18n.__('%s List', this.keyword);
      for (let i = 0; i < users.length; i++){
        response += "\n" +
                    i18n.__('%s has %d %s', users[i].user, users[i].kudos, this.keyword);
      }
      channel.send(response);
    });
  },
  /**
   * A message when bot connects
   */
  connect() {
    console.log(`Welcome to Slack. You are @${this.slack.self.name} of ${this.slack.team.name}`);
  },
  /**
   * Process channels mesages and acts according to message
   * @param message slack message object
   */
  processMessage(message){
    const type = message.type;
    const text = message.text;
    const channel = this.slack.getChannelGroupOrDMByID(message.channel);

    if (type == 'message' && (text != null) && (channel != null)) {
      const re = /<.*?>/g;
      const mentions = text.match(re);
      if(mentions && mentions[0].includes(this.slack.self.id) && text.includes(this.keyword)){
        if(mentions.length == 1){
          return this.kudosList(channel)
        } else if(mentions.length > 1){
          return this.addKudos(channel, mentions[1]);
        }
      }
    } else {
      console.log(`@${this.slack.self.name} could not respond.`);
    }
  },
};

module.exports = KudosBot;

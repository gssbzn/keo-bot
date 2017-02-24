const mongoose = require('mongoose');
const Slack = require('slack-client');
const KudosBot = require('./kudos_bot.js');
const express = require('express');
const app = express();

const cool = require('cool-ascii-faces');
const i18n = require('i18n');

const BotApp = (function() {
  let app;
  let port;
  let slack;
  let db;
  let uristring;

  const publicAPI = {
    init,
    start,
  };

  function init() {
    setupVariables();
    initializeServer();
    setupRoutes();
    setUpI18n();
    initDB();
    initBot();
  }

  function start() {
    // Boot the damn thing
    app.listen(port, function() {
      console.log('Node app is running on port', port);
    });
  }

  function setupVariables() {
    app = express();
    port = process.env.PORT || 5000;
    locale = process.env.LOCALE || 'en';
    uristring = process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/KudosList';
    slack = new Slack(process.env.TOKEN, true, true);
  }

  function initializeServer() {
    app.set('port', port);
  }

  function setupRoutes(){
    app.get('/', function(request, response) {
      response.send(cool());
    });
  }

  function setUpI18n(){
    i18n.configure({
      locales:['en', 'es'],
      directory: `${__dirname}/locales`,
      defaultLocale: locale
    });
  }

  function initDB(){
    mongoose.connect(uristring);
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log('mongo connected');
    });
  }

  function initBot(){
    const kudosBot = new KudosBot(slack);
    slack.on('open', function(){
      kudosBot.connect();
    });
    slack.on('message', function(message) {
      kudosBot.processMessage(message);
    });
    slack.on('error', function(error) {
      return console.error(`Error: ${error}`);
    });
    slack.login();
  }

  return publicAPI;
})();

BotApp.init();
BotApp.start();

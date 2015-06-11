var mongoose = require('mongoose');
var Slack = require('slack-client');
var Keo = require('./keo.js');
var express = require('express');
var app = express();

var cool = require('cool-ascii-faces');

var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/ViraoList';

mongoose.connect(uristring);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('mongo connected');
});

var slack = new Slack(process.env.TOKEN, true, true)

var keo = new Keo(slack);

slack.on('open', function(){
  keo.connect();
});

slack.on('message', function(message) {
  keo.processMessage(message);
});

slack.on('error', function(error) {
  return console.error("Error: " + error);
});

slack.login();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

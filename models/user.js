var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
  user: { type: String, unique: true },
  viraos: { type: Number, default: 0 }
})

userSchema.plugin(findOrCreate);
var User = mongoose.model('User', userSchema);

module.exports = User;

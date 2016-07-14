var Promise = require('bluebird');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  user: {
    type: String,
    unique: true
  },

  password: {
    type: String
  }

})



UserSchema.plugin(require('../plugins/common'));

var User = mongoose.model('User', UserSchema);

Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;

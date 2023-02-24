var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  name: String
}, {collection: "users"});

var userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
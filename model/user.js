var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email : String,
  password : String,
  firstname: String,
  lastname: String,
  validated: Boolean,
});

var User = mongoose.model ('user',userSchema);
module.exports = User;

var mongoose = require('mongoose');
var Ingredients = require('./ingredients')

var userSchema = new mongoose.Schema({
  type : String,
  email : String,
  password : String,
  firstname: String,
  lastname: String,
  validated: Boolean,
  ingredients: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredients' },
});

var User = mongoose.model ('user',userSchema);
module.exports = User;

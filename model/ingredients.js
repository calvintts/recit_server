var mongoose = require('mongoose');
var liaopu = require('./recipe');

var ingredientsSchema = new mongoose.Schema({
  liao: [String],
  liaopu: [String],
  updated: { type: Date, default: Date.now },
});

var Ingredients = mongoose.model ('ingredient',ingredientsSchema);
module.exports = Ingredients;

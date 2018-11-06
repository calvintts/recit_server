var mongoose = require('mongoose');

var ingredientsSchema = new mongoose.Schema({
  liao: [String],
  updated: { type: Date, default: Date.now },
});

var Ingredients = mongoose.model ('ingredient',ingredientsSchema);
module.exports = Ingredients;

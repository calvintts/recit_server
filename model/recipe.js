var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  instructions: [String],
  ingredients: [String],
  date: { type: Date, default: Date.now },
  image: String,
});

var Recipe = mongoose.model ('recipe',recipeSchema);
module.exports = Recipe;

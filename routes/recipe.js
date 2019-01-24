var express = require('express');
var router = express.Router();
var Recipe = require('../model/recipe');

router.post('/add',(req,res)=>
{
  if(!req.body.name) return res.status(422).json({"result":false, "message":"Please specify a recipe name"});
  if(!req.body.instructions) return res.status(422).json({"result":false, "message":"Instructions missing"});
  if(!req.body.ingredients) return res.status(422).json({"result":false, "message":"Ingredients empty"});
  // res.status(200).json({"result":true, "message":"Hello welcome to adding recipe"});
  let instructions = req.body.instructions
  let ingredients = req.body.ingredients
  let name = req.body.name
  var newRecipe = new Recipe()
  newRecipe.name = name
  newRecipe.instructions = instructions
  newRecipe.ingredients = ingredients
  newRecipe.image = image
  newRecipe.save((err,savedRecipe)=>
  {
    if(err){
        console.log(err);
        return res.status(400).json({"result":false, "message":"Error Saving Recipe"});
    }else{
      return res.status(200).json({"result":true, "message":savedRecipe});
    }
  })
})

module.exports = router;

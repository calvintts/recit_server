var Recipe = require('../model/recipe')
const findliaopu = liao => {
    let querydata = liao
    let query = []
    querydata.map(item =>{
          item = {ingredients:new RegExp(item, 'i')}
          query.push(item)
    })
    Recipe.find({$and:query},(err,result)=>{
      if(err)
      {
        return(json(err));
      }else{
        return(json(result));
      }
  });
}


module.exports = findliaopu

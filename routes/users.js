var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Ingredients = require('../model/ingredients')
var md5 = require('md5');
var ExpressBrute = require ('express-brute');
var send_mail = require('../lib/send_mail');
var moment = require('moment');
var findliaopu = require('../lib/updateliaopu')


var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store,{
	freeRetries: 5,
	minWait: 1000 * 60, //1 minute
	maxWait: 10*60*1000, //10 minutes
	failCallback: ExpressBrute.FailTooManyRequests
});



/* GET users listing. */
router.post('/register',function(req,res)
{
    if(!req.body.email) return res.json({"result":false, "message":"Email required"});
    if(!req.body.password) return res.json({"result":false, "message":"Password required"});
    if(!req.body.firstname) return res.json({"result":false, "message":"Firstname required"});
    if(!req.body.lastname) return res.json({"result":false, "message":"Lastname required"});
    var email = req.body.email;
    var password = md5(req.body.password);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.validated = false;
    User.findOne({email:email},function(err,user){
        if(err) {
            console.log(err);
            res.status(400).json(err);
        } else {
            if(user==null) {
                newUser.save(function(err,savedUser){
                    if(err){
                        console.log(err);
                        return res.status(400).json({"result":false, "message":"Failed creating an account"});
                    }
										send_mail(newUser.firstname,newUser.email);
                    return res.status(200).json({"result":true, "message":"Account Registered!"});
                });
            }else{
                console.log(user);
                res.status(400).json({"result":false, "message":"Email already exists"});
            }
        }
    });
});



router.get('/validate/:email',(req,res,next) => {
	let email = req.params.email
	User.findOneAndUpdate({email:email},{$set:{validated:true}},{new:true},(err,result) => {
		if(err)
		{
			console.log(err);
			res.status(500).json(err);
		}
		else{
			result == null ? res.status(404).json({"message": "email not found"}) : res.status(200).json({'message':'validation completed'})
			console.log(result)
		}
	});
})

router.post('/login',bruteforce.prevent,function(req,res,next)
{
  if(!req.body.email) return res.status(400).json({"result":false, "message":"Email required"});
  if(!req.body.password) return res.status(400).json({"result":false, "message":"Password required"});
  var email = req.body.email;
  var password = md5(req.body.password);

  User.findOne({email: email, password: password},function(err,user){
    if(err) {
        // next(err);
      return res.json({"result":false, "message":"Login Failed"});
    } else {
        //if user exists
        console.log(user);
        if(user) {
            return res.status(200).json({
                "result": true,
                "message": "Login success",
                "data": {
                    "firstname": user['firstname'],
                    "lastname": user['lastname'],
										"id": user['_id'],
                }
          });
        }
        // if user doesn't exist
        res.status(400).json({
            "result": false,
            "message": "Login Failed"
        });
    }
  })
});

router.put('/updateliao',(req,res)=>{
	if(!req.body.id) return res.status(400).json({"result":false, "message":"user id required"});
	if(!req.body.ingredients) return res.status(400).json({"result":false, "message":"ingredients required"});
	let id = req.body.id
	let ingredients = req.body.ingredients
	User.findById(id,(err,returnedUser)=>{
		if(err){
			console.log(err)
			res.status(500).json({"result": false, "message": err})
		}else{
			if(returnedUser.ingredients==null)
			{
				let updateIngredients = new Ingredients()
				updateIngredients.liao = ingredients
				updateIngredients.updated = moment()
				updateIngredients.save((err,savedIngredients)=>{
					if(err)
					{
						console.log(err)
						res.status(500).json({"result": false, "message": err})
					}else{
						returnedUser.update({ingredients:savedIngredients},updated=>{
							console.log(updated)
							res.status(200).json({"result":true,"message":savedIngredients})
						})
					}
				})
			}else{
					let iid = returnedUser.ingredients
					Ingredients.findById(iid,(err,returnObj)=>{
						if(err)
						{
							console.log(err)
							res.status(500).json({"result":false,"message":err})
						}else{
							returnObj.liao=ingredients
							returnObj.updated=moment()
							returnObj.liaopu=findliaopu(ingredients)
							returnObj.save((err,updated)=>{
								if(err)
								{
									console.log(err)
									res.status(500).json({"result":false,"message":err})
								}
								else{
									console.log(updated)
									res.status(200).json({"result":true,"message":updated})
								}
							})
						}
					})
			}
		}
	})
})

router.get('/ingredients/:id',(req,res)=>{
	let id = req.params.id
	User.findById(id,(err,returnedUser)=>{
		if(err){
			console.log(err)
			res.status(500).json({"result": false, "message": err})
		}else{
			Ingredients.find(returnedUser.ingredients,(err,returnedIngredients)=>{
				if(err)
				{
					res.status(500).json({"result":false,"message":err})
				}else{
					res.status(200).json({"result":true,"message":returnedIngredients})
				}
			})
		}
	})
})



module.exports = router;

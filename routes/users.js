var express = require('express');
var router = express.Router();
var User = require('../model/user');
var md5 = require('md5');
var ExpressBrute = require ('express-brute');
var send_mail = require('../lib/send_mail');

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
        next(err);
      //return res.json({"result":false, "message":"Login Failed"});
    } else {
        //if user exists
        console.log(user);
        if(user) {
						// req.session.user = user;
            return res.status(200).json({
                "result": true,
                "message": "Login success",
                "data": {
                    "firstname": user['firstname'],
                    "lastname": user['lastname'],
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


module.exports = router;

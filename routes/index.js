var express = require('express');
var userModel = require("../models/users.js");
var pagesModel = require("../models/pages.js");
var moment = require('moment');
var router = express.Router();

//data can be urlencoded key value pairs
//This should only have homepage,login, and register


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/home");
});

router.get('/home', function(req, res, next) {
  res.render('landing',{link:"testing"});
});


// gets the login page
router.get('/auth/login',function(req,res,next){
	res.render('login');
});

//finds login credentials if its there its gucci
router.post('/auth/login',function(req,res,next){
		userModel.findOne({email: req.body.email},function(err,foundUser){
			console.log("it went through here");
			if(err){
				console.log(err);
				res.render('login',{error:err});
			}
			else if(foundUser === null || foundUser === undefined){
				console.log("===================================hello============================");
				console.log("hello");
				res.render('login',{error:"user not found"});
			}
			else if(req.body.password === foundUser.password){
				console.log("password works");
				req.session.user = foundUser;
				console.log('successful login')
				res.redirect('/admin/' + req.session.user.id);
			}
			else{
				res.render('login',{error:"wrong password"});
			}
		});
	
});

//gets the register route 
router.get('/auth/register',function(req,res,next){
	res.render("register");
	//res.render('login');
});



//creates a user if email and password is good
//check if there is another user in the database
router.post('/auth/register',function(req,res,next){
	console.log(req.body);
	var formData ={
		email: req.body.email,
		password: req.body.password
	}
	console.log(formData);
	userModel.create(formData, function(err, newUser){
		console.log(newUser);
		if(err){
			if(err.code === 11000){
				console.log("it goes here")
				res.render("register",{msg:"duplicate email"})
			}
			
			res.render("register",{msg:"something went wrong try again"});
		} else {
			console.log(newUser);
			res.redirect('/auth/login')		
		}
	})
	

});

//reset session and redirect to home page
router.get('/auth/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});


router.get('/dashboard/',function(req,res,next){
	pagesModel.find({visible:true},function(err,foundPages){
		if(err){
			console.log(err);
		}
		else if(foundPages == null || foundPages == undefined){
			res.redirect("/auth/login");
		}
		else{
			console.log(foundPages);
			res.render("dashboardVisible",{pages:foundPages,moment:moment});
		}
	});
	
});
router.get('/showpage/:id',function(req,res,next){

	pagesModel.findOne({_id: req.params.id, visible:true},function(err,foundPage){
		console.log(foundPage);
		if(err){
			console.log(err);
			res.json(err);
		}
		else if(foundPage == null){
			console.log("didnt find it");
			res.send("didnt find it content");
		}
		else {
			console.log(foundPage);
			res.render("template",{page: foundPage});
		}

	})
	
});

module.exports = router;

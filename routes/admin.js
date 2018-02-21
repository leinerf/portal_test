var express = require("express");
var router = express.Router();
var moment = require('moment');
var pagesModel = require("../models/pages.js");
var isAuthenticated = require("../middleware/loginAuthentication.js");


//reroute to homepage if user not found;
router.use(isAuthenticated);


//dashboard with id
router.get('/:id',function(req,res,next){
	console.log(req.user)
	pagesModel.find({user: req.user._id},function(err,foundPages){
		if(err){
			console.log(err);
		}
		else if(foundPages == null || foundPages == undefined){
			res.redirect("/auth/login");
		}
		else{
			res.render("dashboard",{pages:foundPages,moment:moment,user_id:req.user._id});
		}
	});
	
});


//sends person to addpage
router.get('/addpage/:id',function(req,res,next){
	res.render("addpage",{user_id:req.params.id});
});

//where to add the page 
//check to make sure url is unique
router.post('/addpage/:id',function(req,res,next){
	console.log(req.body);
	var formData ={
		title: req.body.title,
		content: req.body.content,
		url: req.body.url,
		user: req.params.id,
		visible: true
	}

	console.log(formData);
	pagesModel.create(formData, function(err, newUser){
		console.log(newUser);
		if(err){
			console.log(err);
			if(err.code== 11000){
				return res.json({msg:"duplicate url",success:0})
			}
			res.json(err.message);

		} else {
			console.log(newUser);
			res.json({title:newUser.title,content:newUser.content,url:newUser.url,id:newUser._id,date:newUser.date,success:1});
		}
	})
	

});
//returns an edit page based on id
router.get('/editpage/:id',function(req,res,next){
	pagesModel.findById(req.params.id,function(err,foundPage){
		if(err){
			console.log(err);
			res.json(err);
		}
		else if(foundPage == null){
			console.log("didnt find it");
			res.send("didnt find it");
		}
		else if(foundPage.user != req.user._id){
			req.session.reset();
  			res.redirect('/');
		}
		else {
			console.log(foundPage);
			res.render("editPage",{page: foundPage});
		}

	})
	
});

//posts the form data from edit page 
//I should check for unique url 
router.post('/editpage/:id',function(req,res,next){
	console.log(req.body);
	var formData = {
					title: req.body.title,
					content: req.body.content,
					url: req.body.url,
					date: Date.now()
				}
	console.log(formData);
	pagesModel.findByIdAndUpdate(req.params.id,formData, function(err,foundPage){
		if(err){
			console.log(err);
			res.json(err);
		}
		else if(foundPage == null){
			console.log("didnt find it");
			res.send("didnt find it");
		}
		else {
			console.log('post')
			console.log(foundPage);
			res.redirect('/admin/' + req.params.id);
		}

	})
	
});


//show the template
router.get('/showpage/:id',function(req,res,next){
	pagesModel.findById(req.params.id,function(err,foundPage){
		if(err){
			console.log(err);
			res.json(err);
		}
		else if(foundPage == null){
			console.log("didnt find it");
			res.send("didnt find it");
		}
		else {
			console.log(foundPage);
			res.render("template",{page: foundPage});
		}

	})
	
});

//post route for the visible button 
router.put('/visible/:id',function(req,res,next){
	pagesModel.findOne({_id:req.params.id}, function(err,foundPage){
		if(err){
			console.log(err);
			res.json(err);
		}
		else if(foundPage == null){
			res.send("didnt find it");
		}
		else {
			foundPage.visible = !foundPage.visible;
			pagesModel.update({_id: foundPage._id }, foundPage, function(err) {
			  if(err){
			  	console.log(err)
			  }
			  else{
				res.json({visible: foundPage.visible});
			  }
			});
		}
	});
});


//route for delete
router.delete('/delete/:id',function(req,res){
	console.log("it goes here too");
	console.log(req.params.id);
	pagesModel.findById(req.params.id,function(err,foundPage){
		console.log(foundPage);
	})
	pagesModel.remove({_id :req.params.id.trim()},function(err){
		if(err){
			console.log(err);
			res.send(err);
		}
		else{
			console.log("its goind here")
			res.end();
		}
	});

});
	

module.exports = router;

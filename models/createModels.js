var mongoose  = require('mongoose');
var userModel = require("./users.js");
var pagesModel = require("./pages.js");


mongoose.connect("mongodb://localhost/test");//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED ON DATABASE');
});

userModels = [
	{
		email: "helloWorld1@gmail.com",
		password: "IdkaboutYou"
	},
	{
		email: "helloWorld2@gmail.com",
		password: "IdkaboutYou"
	},
	{
		email: "helloWorld3@gmail.com",
		password: "IdkaboutYou"
	},
	{
		email: "helloWorld4@gmail.com",
		password: "IdkaboutYou"
	}
]

pagesModels =[
	{
	title: "Something1",
	content:"qrqwerqwerqwer",
	url: "qpwoieh",
	visible: true

	},
	{
	title: "Something2",
	content:"qrqwerqwerqwer",
	url: "qpwoiehr",
	visible: true

	},
	{
	title: "Something3",
	content:"qrqwerqwerqwer",
	url: "qpwoie",
	visible: true

	},
	{
	title: "Something4",
	content:"qrqwerqwerqwer",
	url: "qpwoi",
	visible: true

	},
	{
	title: "Something5",
	content:"qrqwerqwerqwer",
	url: "qpwo",
	visible: true

	},
	{
	title: "Something6",
	content:"qrqwerqwerqwer",
	url: "qpwo",
	visible: true
	
	}

]


var createUserModels = function(model,content){
	
	for(var i = 0; i < content.length;++i){
		model.create(content[i], function(err, newModel){
		console.log(newModel);
		if(err){
			console.log(err);
		
		} else {
			console.log("eirhqowierh")
			console.log(newModel);
		
		}
	});
	}
};

var createPageModels = function(model,modelData,email){
	console.log(typeof email);
	userModel.findOne({email: "helloWorld1@gmail.com"},function(err,foundUser){
		if(err){

		}
		else if(foundUser ){
			for(var i = 0; i < modelData.length;++i){
				console.log(foundUser);
				modelStructure = {
					user: foundUser.id,
					title: modelData[i].title,
					content:modelData[i].content,
					url: modelData[i].url,
					visible: modelData[i].visible
				}
				console.log("woi325123oicnu412039u4 c12ou34c12 po3iu41p2 ocu42op13iu4 cp12ou4 po21i3u4 cpoehrqpowiehrpo");
				console.log(modelStructure);
				model.create(modelStructure, function(err, newModel){
					console.log(newModel);
					if(err){
						console.log(err);
					
					} else {
						console.log(newModel);
					
					}
				});
			}
		}

	});
	
};
// createUserModels(userModel,userModels);




userModels.forEach(function(model){
	console.log(model.email)
	createPageModels(pagesModel,pagesModels,model.email);
});






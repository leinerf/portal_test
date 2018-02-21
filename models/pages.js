var mongoose  = require('mongoose');

var pagesSchema = mongoose.Schema({
	
	title: { type : String , required : true },
	content: { type : String , required : true },
	url: { type : String ,unique: true, required : true },
	date: { type: Date, default: Date.now },
	visible: {type: Boolean, required:true},
	user: { type : String, ref : 'users' }
});

var pagesModel = mongoose.model('pages', pagesSchema);

module.exports = pagesModel;
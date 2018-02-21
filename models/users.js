var mongoose  = require('mongoose');

var userSchema = mongoose.Schema({
	email: { type : String , unique : true, required : true },
	password: { type : String ,unique: false, required : true }
})

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;
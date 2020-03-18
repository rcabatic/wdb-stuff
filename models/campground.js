mongoose 	= require("mongoose"); 

//====Set up DB Schema:=====
 
var campgroundSchema = new mongoose.Schema({
   name: String,
	price: String,
   image: String,
   description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment" //name of ref model.
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema); //exports campground model.

//then Require campground.js


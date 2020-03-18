//MIDDLEWARE INDEX //

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//AUTHORIZATION CAMPGROUND MIDDLEWARE:
middlewareObj.checkCampgroundOwnership = 
	
	function(req, res, next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found, something went wrong!");
				res.redirect("back");
			}else{
				//does user own campground?
				if(foundCampground.author.id.equals(req.user._id)){ //matched IDs
					next(); //Continue through code
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			};
		});
		}else{
			req.flash("error", "You need to be logged in first!");
			console.log("Need User Log in.");
			res.redirect("back");
		}
	};

//COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = 
	function(req, res, next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				//does user own COMMENT?
				if(foundComment.author.id.equals(req.user._id)){ //matched IDs
					next(); //Continue through code
				}else{
					req.flash("error", "You do not have permission to do that!");
					res.redirect("back");
				}
			};
		});
		}else{
			console.log("Need User Log in.")
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("back");
		}
	};

/// LOGGED IN MIDDLEWARE:
middlewareObj.isLoggedIn = 
	function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "You need to be logged in to do that!"); //put before the redirect.
		res.redirect("/login");
	};


//EXPORT MIDDLEWARE OBJ:

module.exports = middlewareObj;
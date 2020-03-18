var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res ){
	res.render("landing");
});

//===== AUTHENTIFICATION ROUTES: ======

//show register form:
router.get("/register", function(req, res){
	res.render("register");
})

//handles user signup.
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){ 
		if(err){
			//console.log(err);
			req.flash("error", err.message);
			return res.redirect("/register"); //short circuit.
		} 
		passport.authenticate("local")(req, res, function(){ //use local thing... (vs facebook, twitter, etc)
			//after user is logged in, redirect to the page:
			req.flash("success", "Welcome to YELPCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});	
});

//LOG IN ROUTES:

router.get("/login", function(req, res){
	res.render("login");
});

//Handles Login Logic. 
//uses middleware -> passport.authenticate
router.post("/login", passport.authenticate("local", { 
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}), function(req, res){
});

//log out route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You out!");
	res.redirect("/campgrounds");
});


module.exports = router;



var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //index is implied bc middleware is a directory

//======= CAMPGROUND ROUTES =====================================

//SHOWS INDEX
router.get("/", function(req, res ){
	//SHOWS ALL CAMPGROUNDS from DB and then RENDER.
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
	
});

//ADD CAMPGROUND TO DB:
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data... and posts to Array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price:price, image: image, description: desc, author: author};
	//Create a new campground and save to DB:
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){ //if there's a problem with the form...
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//SHOW FORM TO LINK TO CREATE
router.get("/new", middleware.isLoggedIn, function(req, res){
	//Shows the form that will use the Post route.
	res.render("campgrounds/new.ejs");
});

//SHOWS INFO ABOUT SPECIFIC CAMPGROUND: /campgrounds/:id 
//Needs to be after campgrounds/new
router.get("/:id",  function(req, res){
	//res.send("Show page.") //init tester
	//find campground with specific ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground})
		};
	});
});

//EDITING CAMPGROUND ROUTE: (form)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){ 
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE: (submission)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground, then redirect.
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log("Problem with Updating Campground..");
			res.redirect('/campgrounds');
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//======DESTROY CAMPGROUND ROUTE:================
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
			console.log("error with deleting campground. ")
		}else{
			res.redirect("/campgrounds");
		}
	})
});



module.exports = router;


//===========================================================
//===========================================================
//=========Creation Example:==============================================================

// Campground.create(
// 	{	
// 		name: "New Leaf Camp",
// 	 	image: "https://farm4.staticflickr.com/3943/15339365947_d91e0831d8_b.jpg",
// 		description: "This is a beautiful place with lots of Racoons!"
// 	}

// , function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("Newly Created Campground");
// 		console.log(campground);
// 	}
// });

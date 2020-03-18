var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	passport              	= require("passport"),
	LocalStrategy         	= require("passport-local"),
    passportLocalMongoose	= require("passport-local-mongoose"),
	User 					= require("./models/user"),
	Campground 				= require("./models/campground"),
	Comment 				= require("./models/comment"),
	methodOverride			= require("method-override"),
	seedDB 					= require("./seeds");


//Requiring Routes
var commentRoutes			= require("./routes/comments"),
	campgroundRoutes 		= require("./routes/campgrounds"),
	indexRoutes 			= require("./routes/index");

//seedDB(); //SEEED MEEEE
mongoose.set('useUnifiedTopology', true); //for depreceation warning...
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true}); //creates yelpcamp db.

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public")); //safer if directory changed., for stylesheet. 
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash()); //flash messages.

//=========Passport Config:=======
app.use(require("express-session")({
	secret: "Camping is awesome woohoo",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Call function on every single route.
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next(); //very important
});

//=========================ROUTER USE FUNCTION:===========================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//======================== LISTEN AND RUN =====================================

app.listen(3000, function(){ 
	console.log('YELP CAMP SERVER INITIATED.');
});
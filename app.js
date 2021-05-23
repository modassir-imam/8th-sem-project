var PORT=process.env.PORT || 3000;

var exp=require('express');
var app=exp();
var mongo=require('mongoose');
var bodyParser=require('body-parser');
var methodOverride=require("method-override");
var expSanitizer=require('express-sanitizer');
const path = require('path');

mongo.set('useNewUrlParser', true);
mongo.set('useUnifiedTopology', true);
mongo.set('useFindAndModify', false);


app.set("view engine","ejs");
app.use(exp.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expSanitizer());



var passport 				=require('passport');
const LocalStrategy 		= require('passport-local'); 
var passportLocalMongoose 	=require("passport-local-mongoose");


var flash=require("connect-flash");

app.use(require("express-session")({
	secret:"Rusty is the best dog",
	resave:false,
	saveUninitialized:false
}));


var User=require("./models/user");



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




mongo.connect("mongodb://localhost/final_year");







//================================================================
//				ROUTES
//================================================================

app.get("/",function(req,res){
	res.render("index.ejs");
});


app.get("/index",function(req,res){
	res.render("index.ejs");
});


app.get("/about",function(req,res){
	res.render("aboutus.ejs");
});


app.get("/student",function(req,res){
	res.render("student.ejs");
});


app.get("/loggedin",function(req,res){
	res.render("loggedin.ejs");
});

app.get("/registered",function(req,res){
	res.render("registered.ejs");
});

app.get("/loginfail",function(req,res){
	res.render("loginfail.ejs");
});


app.post("/login",passport.authenticate("local",{
	successRedirect:"/loggedin",
	failureRedirect:"/loginfail"
}),function(req,res){
});


function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	// req.flash("error","please login first");
	res.redirect("/loginfail");
}


app.get("/logout",isLoggedIn,function(req,res){
	req.logout();
	// req.flash("success","Logged out!!!");
	res.redirect("/index");
});


app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if (err) 
	      {
	      	// req.flash("error",err.message);
	        return res.render("index.ejs");
	      }
	     else
	     {
	     	passport.authenticate("local")(req,res,function(){
	     		// req.flash("success","Successfully registered");


	     		var ins=req.body.institute;
	     		var em=req.body.email;
				var tp='s';
				user.institute=ins;
				user.email=em;
				user.type=tp;
				user.save(function(err){
					if(err)
						console.log("Error");
					else
						console.log("Everything worked fine");
				});

	     		res.redirect("/registered");
	     	})
	     }
	});
});


app.post("/register/t",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if (err) 
	      {
	      	// req.flash("error",err.message);
	        return res.render("index.ejs");
	      }
	     else
	     {
	     	passport.authenticate("local")(req,res,function(){
	     		// req.flash("success","Successfully registered");


	     		var ins=req.body.institute;
	     		var em=req.body.email;
				var tp='t';
				user.institute=ins;
				user.email=em;
				user.type=tp;
				user.save(function(err){
					if(err)
						console.log("Error");
					else
						console.log("Everything worked fine");
				});

	     		res.redirect("/registered");
	     	})
	     }
	});
});










app.listen(PORT,function(){
	console.log("Server has started");
});
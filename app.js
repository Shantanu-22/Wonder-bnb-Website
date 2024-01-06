if(process.env.NOD_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const override = require("method-override");
const mate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const Mongo_url = process.env.ATLASDB_URL;

app.use(override('__method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended:true}));
app.engine("ejs",mate);

main().then(()=>{
    console.log("DB is connected Successfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(Mongo_url);
}

const store = MongoStore.create({
    mongoUrl : Mongo_url,
    crypto :{
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("err",()=>{
    console.log("ERROR IN SESSION STORE",err);
})

// all the session options 
const sessionOption = {
    store:store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        //cookie expiry date in 7 days : week * hour * min * sec * milisec
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true // to prevent cross scripting attcks
    }
}

//session middleware
app.use(session(sessionOption));

//flash middleware declare before the routes
app.use(flash());

app.use(passport.initialize());
//in the same session one user nevigate throuth the routes so we use passport.session 
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); //means store in the session 
passport.deserializeUser(User.deserializeUser());//means remove from the session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingsRouter);

//here we have to also send the id to the review.js file so we use merge-params here
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);


//Wrong Route error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found !!"));
});

//Error Middleware
app.use((err,req,res,next)=>{
    let {status=400,message="Page not Found !!"} = err;
    res.status(status).render("error.ejs",{message});
});


app.listen("8080",()=>{
    console.log("Server Start");
})



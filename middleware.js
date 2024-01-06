const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingsSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        /*want to redirect the page where we want to go after loggin so we save the original requested url in the session with 
        declaring a variahle redirectUrl so we can access these variable at any time*/
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please logged in first to add listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        /*bcz everytime the original url req is reset after the page load so we have to save it in the local , local is not changing
        with the refreshes */
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    const list = req.body.list;
    let currentlist = await listing.findById(id);
    //authentication for the someone want to edit the list but that have no permission to edit
    if(!currentlist.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this list");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingsSchema.validate(req.body);
    if(error){
        let ermsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,ermsg);
    }
    else{
        next();
    }
}

//Review post Route

module.exports.validateReviews = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let ermsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,ermsg);
    }
    else{
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,revId} =  req.params;
    let currentlist= await Review.findById(revId);
    //authentication for the someone want to edit the list but that have no permission to edit
    if(!currentlist.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not allowd to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


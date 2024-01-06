const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

module.exports.getSignUp = (req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.postSignUp = async(req,res) => {
    try{
        let {username , email , password}= req.body;
        const newuser = new User({email , username});
        const regUser = await User.register(newuser,password);
        req.login(regUser,(err) => {
            if(err){
                return next(err);
            };
            req.flash("success","Welcome to Wonder-BnB");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin =  (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.postLogin  = async(req,res)=>{
    req.flash("success","Welcome Back !");
    /*when we want to login from the listing page the saveurl middleware does not invoked so the local redirecturl 
    variable is undefied in that case so we use or case to load the listing page*/
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.getLogout = (req,res,next) => {
    req.logOut((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    })
};
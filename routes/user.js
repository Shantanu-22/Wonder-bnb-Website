const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
    .get(userController.getSignUp)
    .post(wrapAsync(userController.postSignUp));

router.route("/login")
    .get(userController.getLogin)
    .post(
    saveUrl,
    passport.authenticate("local",{failureRedirect :"/login",failureFlash : true}),
    wrapAsync(userController.postLogin)
);                                          

router.get("/logout",userController.getLogout);

module.exports = router;
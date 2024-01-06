const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingsController = require("../controller/listings.js");
const multer  = require('multer');
const {cloudinary,storage}= require("../cloudeConfig.js");
const upload = multer({ storage});

router.route("/")
    //index get request
    .get(wrapAsync(listingsController.index ))
    //adding new listing post request
    .post(isLoggedIn ,upload.single('list[image]'),validateListing,wrapAsync( listingsController.postNewListings));
    

//new listing get request 
router.get("/new",isLoggedIn,listingsController.getNewListings);

router.route("/:id")
    //show listings get request
    .get(wrapAsync( listingsController.showlisting))
    //updating the listings put request
    .put(isLoggedIn,isOwner,upload.single('list[image]'),validateListing,wrapAsync( listingsController.putEditListings))

    //destroy the listings delete request
    .delete(isLoggedIn,isOwner,wrapAsync( listingsController.destroylistings));


//editing the listing get request
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingsController.getEditListings));



module.exports = router;
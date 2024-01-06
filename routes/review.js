const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controller/review.js");


router.post("/",isLoggedIn,validateReviews,wrapAsync(ReviewController.postAddReview));

//review delete route
router.delete("/:revId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview)); 

module.exports = router;
const Review = require("../models/review");
const listing = require("../models/listing");

module.exports.postAddReview = async(req,res)=>{
    let list = await listing.findById(req.params.id).populate("owner");
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    list.reviews.push(newreview);
    await newreview.save();
    await list.save();
    res.redirect(`/listings/${list._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,revId} =  req.params;
    await listing.findByIdAndUpdate(id, {$pull:{reviews : revId}});
    await Review.findByIdAndDelete(revId);

    res.redirect(`/listings/${id}`);
}



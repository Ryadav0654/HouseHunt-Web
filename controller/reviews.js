const Listing = require("../models/listing.js");
const Review = require("../models/review.js")

const createReview = async (req, res) => {
    // console.log(req.body);
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new review was created");
    // console.log("new review was created");
    res.redirect(`/listings/${id}`);
  };

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review was deleted");
    res.redirect(`/listings/${id}`);
  }


  module.exports = {createReview, deleteReview};
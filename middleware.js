const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { reviewSchema, listingSchema } = require("./schema.js");

// isloggedIn middleware which check user logged in or not 
const isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please login first!");
        return res.redirect("/login");
    }
    next();
}

// saveRedirectUrl middleware save the original url in locals 
const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }  
    next();
};

// validate listing function
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  };

  // validate review function
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    next();
  };

const isOwner = async (req, res, next) => {
  let {id } = req.params;
  let listing = await Listing.findById(id);
  if(! listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

const isReviewAuthor = async (req, res, next) => {
  let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(! review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports = {isloggedIn, saveRedirectUrl, validateListing, validateReview, isOwner, isReviewAuthor};
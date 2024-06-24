const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isloggedIn, isReviewAuthor } = require("../middleware.js");
const {createReview, deleteReview} = require("../controller/reviews.js");

// create post route for reviews
router.post(
  "/",
  isloggedIn,
  validateReview,
  wrapAsync(createReview)
);

// delete review route
router.delete(
  "/:reviewId",
  isloggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;

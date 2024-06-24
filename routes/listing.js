const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, validateListing, isOwner } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
const {
  showAllListings,
  renderNewListingForm,
  showListing,
  renderEditListingForm,
  updateListing,
  deleteListing,
  createNewListing,
} = require("../controller/listings.js");

//index and create new listing route
router.route("/")
.get( wrapAsync(showAllListings))
.post( isloggedIn, upload.single('listing[image]'),validateListing, wrapAsync(createNewListing));



// new listing adding route
router.get("/new", isloggedIn, renderNewListingForm);

//create route
/*
  router.post("/listings", async (req, res, next) => {
    try {
      let newListing =  new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    }catch(err)  {
      next(err);
    }
  })
  
  */

// show route, update and delete route
router.route("/:id")
.get( wrapAsync(showListing))
.put( isloggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(updateListing))
.delete( isloggedIn, isOwner, wrapAsync(deleteListing));

// edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(renderEditListingForm));

module.exports = router;

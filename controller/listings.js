const Listing = require("../models/listing.js");
const axios = require("axios");

const showAllListings = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

const renderNewListingForm = (req, res) => {
  res.render("./listings/new.ejs");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

const createNewListing = async (req, res, next) => {
  const location = req.body.listing.location;

  const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: location,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "househunt/1.0 (househunt@info.com)",
    },
  });

  const { lat, lon } = geoRes.data[0];

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat],
  };

  await newListing.save();
  req.flash("success", "New Listing Added!");
  res.redirect("/listings");
};

const renderEditListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_150");
  // console.log(originalImageUrl);
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

const updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

const deleteListing = async (req, res) => {
  let { id } = req.params;
   await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports = {
  showAllListings,
  renderNewListingForm,
  showListing,
  createNewListing,
  renderEditListingForm,
  updateListing,
  deleteListing,
};

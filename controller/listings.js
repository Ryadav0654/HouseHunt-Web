const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  let coordinate = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // console.log(coordinate.body.features[0].geometry);
  // res.send("done!");

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  // console.log(`url: ${url} and filename: ${filename}`);
  newListing.image = { url, filename };
  newListing.geometry = coordinate.body.features[0].geometry;
  await newListing.save();
  // console.log(savedlisting);
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

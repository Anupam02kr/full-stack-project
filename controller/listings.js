const listing = require("../models/listing");
const geocode = require("../utils/geocode");

module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await listing
    .findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/");
  }
  res.render("listings/show.ejs", { list });
};

module.exports.renderNewForm = async (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listin = await listing.findById(id);
  if (!listin) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/");
  }
  res.render("listings/edit.ejs", { listin });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const list = await listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true,
  });

  if (req.file) {
    list.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await list.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect("/");
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted!");
  return res.redirect("/");
};

module.exports.createListing = async (req, res, next) => {
  const location = req.body.listing.location;

  const coords = await geocode(location);

  if (!coords) {
    req.flash("error", "Location not found");
    return res.redirect("/listings/new");
  }

  req.body.listing.geometry = {
    type: "Point",
    coordinates: [coords.lng, coords.lat],
  };

  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  await newListing.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/");
};

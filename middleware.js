const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");
const listing = require("./models/listing");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  } 
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next) => {
  const {id} = req.params;
  const listin = await listing.findById(id);
  if(!req.user && !listin.owner.equals(req.user._id)){
    req.flash("error","You don`t have permission to do that!");
    return res.redirect(`/listing/${id}`);
  } 
  next();
}; 

module.exports.validatingListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validatingReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); 
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  };
};

module.exports.isReviewAuthor = async(req, res, next) => {
  const {  id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listing/${id}`);
  }
  next();
}; 
const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReviews = async (req, res) => {
    let listingDoc = await listing.findById(req.params.id); 
   
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listingDoc.reviews.push(newReview);

    await newReview.save();
    await listingDoc.save();
    req.flash('success', 'Created new review!'); 
    res.redirect(`/listing/${listingDoc._id}`);
  }

module.exports.destroyReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!'); 

    res.redirect(`/listing/${id}`);
  }  
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const {validatingReview, isLoggedIn,isReviewAuthor,} = require("../middleware");
const reviewsController = require("../controller/reviews");

//Review (post route)
router.post("/", isLoggedIn, validatingReview, reviewsController.createReviews);

//delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.destroyReviews)
);

module.exports = router;

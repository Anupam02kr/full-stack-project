const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controller/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.use(express.urlencoded({ extended: true }));

//Index route
router.get("/", wrapAsync(listingController.index));

router
  .route("/listings/:id")
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));

//show route
router.get("/listing/:id", wrapAsync(listingController.showListing));

// new form
router.get("/listings/new", isLoggedIn, listingController.renderNewForm);

//create route
router.post(
  "/listing",
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);


//edit route
router.get(
  "/listings/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// update route
router.put(
  "/listing/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
);





module.exports = router;


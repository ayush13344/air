const express=require('express');
const router=express.Router();
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


//Index Route
router.get("/",listingController.index );
  
  //New Route
  router.get("/new",isLoggedIn,listingController.renderNewForm);
  
  //Show Route
  router.get("/:id", listingController.showListing);
  
  //Create Route
  router.post("/",isLoggedIn, upload.single("listing[image]"),listingController.createListing);
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn, isOwner,listingController.renderEditForm);
  
  //Update Route
  router.put("/:id",isLoggedIn,isOwner, upload.single("listing[image"),listingController.updateListing);
  
  //Delete Route
  router.delete("/:id",isLoggedIn,isOwner, listingController.destroyListing);

  module.exports=router;
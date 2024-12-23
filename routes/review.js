const express=require('express');
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isReviewOwner } = require('../middleware.js');
const reviewsController=require("../controllers/reviews.js");
//reviews 
//post route
router.post("/",isLoggedIn,reviewsController.createReview);
  //delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewOwner,reviewsController.destroyReview);
  module.exports=router;
const Listing=require("./models/listing");
const Review=require("./models/reviews");
module.exports.isLoggedIn=(req,res,next)=>{
  console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You need to be logged in to do that !");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the owner of that listing !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewOwner=async(req,res,next)=>{
  let { id,reviewId } = req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the owner of that review !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
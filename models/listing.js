const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js");
const listingSchema=new Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review", 
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
        type:String,
        enum:['Point'],
        required:true,
    },
    coordinates:{
        type:[Number],
        required:true,
    }
},
    category:{
        type:String,
        enum:["mountains","arctic","farms","deserts"],
    }
});

listingSchema.post("findOneAndDelete",async function(listing){
    if(listing){
        const res = await Review.deleteMany({_id:{$in:listing.reviews}});
        console.log(res);
    }
});

const Listing = mongoose.model("listing",listingSchema);
module.exports=Listing;
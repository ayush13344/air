if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
//const MONGO_URL = "mongodb://127.0.0.1:27017/air";
const session=require("express-session");
const MongoStore=require("connect-mongo");
const listings =require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const user=require("./routes/user.js");
const dbURL=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,
});

store.on("error",()=>{
  console.log("store error");
})
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};
/*app.get("/", (req, res) => {
  res.send("Hi, I am root");
});*/

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
});
app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"stu@gmail.com",
    username:"student"
  });
  let registeredUser= await User.register(fakeUser,"chicken");
  res.send(registeredUser);
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

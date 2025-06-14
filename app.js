if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");
const homeRouter = require("./routes/home.js");

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

const dbUrl = process.env.ATLASDB_URL;

// define main function
;( async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch {
    console.log("Database connection error", error);
  }
})();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in Mongo session store!", error);
});
// define session options and use session middleware
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// session middleware
app.use(session(sessionOptions));
app.use(flash());

// authentication code
app.use(passport.initialize()); // initialise the passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash msg middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// demouser router
/*
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "@Demo-user2",
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  console.log(registeredUser);
  res.send(registeredUser);

})

*/

// router middleware define
app.use("/", homeRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// console.log(Listing);

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

// if incoming request is not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// handling custom errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong." } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
  // res.status(statusCode).send(message);
  // res.send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

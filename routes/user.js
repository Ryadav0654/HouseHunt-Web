const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignupForm,
  SignUp,
  renderLoginForm,
  Login,
  Logout,
} = require("../controller/users.js");

// signup router
router.route("/signup")
.get(renderSignupForm)
.post(wrapAsync(SignUp));

// login router
router.route("/login")
.get( renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  Login
);

// logout router
router.get("/logout", Logout);

module.exports = router;

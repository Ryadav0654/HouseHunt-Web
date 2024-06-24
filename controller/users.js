const User = require("../models/user.js");
const renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

const SignUp = async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
          if(err){
            return next(err);
          }
          req.flash("success", "Welcome to Wanderlust");
          res.redirect("/listings");
      })
     
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  };


const renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
  };

const Login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

const Logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
        return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};

module.exports = {renderSignupForm, SignUp, renderLoginForm, Login, Logout};

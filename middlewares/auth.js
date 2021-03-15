const jwt = require("jsonwebtoken");
const User = require("../models/users");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  //check if token exists and is verified

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        //res.redirect('/login')
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log("Please Login");
    // res.redirect('/login')
  }
};

//Get Current User

const getUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        console.log(user);
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {requireAuth, getUser};

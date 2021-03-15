const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");

const handleAuthErrors = (err) => {
  console.log(err.message, err.code);

  let errors = {email: "", password: "", username: ""};

  //empty Email field
  if (err.message === "Please Enter an Email address") {
    errors.email = "Please Enter an Email address";
    return errors;
  }

  //rubbish email
  if (err.message === "Please Enter a valid Email") {
    errors.email = "Please Enter a valid Email";
    return errors;
  }

  //empty password field
  if (err.message === "Please Enter a Password") {
    errors.password = "Please Enter a Password";
    return errors;
  }

  //short password

  if (err.message === "Minimum Password Length is 6") {
    errors.password = "Minimum Password Length is 6";
    return errors;
  }

  //empty username field
  if (err.message === "Please Enter Your Username") {
    errors.username = "Please Enter Your Username";
    return errors;
  }

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "Email already exists";
    errors.username = "Username already exists";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//create token
const maxAge = 3 * 24 * 60 * 60; //Three days

const createtoken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.register = async (req, res) => {
  const {email, password, username} = req.body;

  try {
    const user = await User.create({email, password, username});
    const token = createtoken(user._id);
    res.cookie("jwt", token, {httponly: true, maxAge: maxAge * 1000});
    res.status(201).json({user: user._id});
    console.log(user);
  } catch (err) {
    const errors = handleAuthErrors(err);
    res.status(400).json({errors});
  }
};

module.exports.login = async (req, res, next) => {
  const {username, password} = req.body;

  const user = await User.findOne({username});

  if (!user) return res.status(400).json("User does not exist");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).json("Invalid Password");

  //create and assign token
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
  res.header("jwt", token).send(token);
  console.log(user.username);
  //redirect to home
};

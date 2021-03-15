const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter Your Username"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter an Email address"],
      unique: true,
      validate: [isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter a Password"],
      minlength: [6, "Minimum Password Length is 6"],
    },
  },
  {
    timestamps: true,
  }
);

//basically do this before you save

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;

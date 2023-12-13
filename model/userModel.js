const mongoose = require("mongoose");

const secret = process.env.SECRET;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Enter an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter password"],
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);

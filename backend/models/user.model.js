const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    minlength: [3, "First name should be minimum 3 characters long"],
  },
  lastname: {
    type: String,
    minlength: [3, "First name should be minimum 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Email should be minimum 3 characters long"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    default: "",
    maxlength: 100,
  },
  currentposition: {
    type: String,
    default: "",
    maxlength: 100,
  },
  location: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  profilepicture: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model("userModel", userSchema);

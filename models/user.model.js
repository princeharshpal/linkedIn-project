const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
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

userSchema.methods.hashPassword = async (password) => {  // maybe statics comes in place of methods
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = () => {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

module.exports = mongoose.model("User", userSchema);

const User = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  const hashedPassword = await User.hashPassword(password);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = User.generateAuthToken();
  res.status(200).json({ token, newUser });
};

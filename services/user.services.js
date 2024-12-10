const User = require("../models/user.model");

module.exports.createUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = User.create({
    username,
    email,
    password,
  });

  return user;
};

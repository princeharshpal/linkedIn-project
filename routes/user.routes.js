const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

router.post(
  "/register",
  [
    body("email").trim().isEmail().withMessage("Invalid Email"),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Firstname must be 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long"),
  ],
  userController.registerUser
);

module.exports = router;

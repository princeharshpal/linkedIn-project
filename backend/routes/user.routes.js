const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), userController.uploadProfilePicture);

router.route("/user_update").post(userController.updateUserProfile);

router.route("/get_user_and_profile").get(userController.getUserAndProfile);

router.route("/update_profile_data").post(userController.updateProfileData);

router.route("/user/get_all_users").get(userController.getAllUserProfile);

router.route("/user/:id/download_profile").get(userController.downloadProfile);

module.exports = router;
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controllers");

router.route("/").get(postController.check);

module.exports = router;

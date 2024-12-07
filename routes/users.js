const express = require("express");
const router = express.Router();

router.get("/feed", (req, res) => {
  res.render("pages/feed");
});

module.exports = router;

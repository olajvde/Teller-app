var express = require("express");
var router = express.Router();
const {requireAuth, getUser} = require("../middlewares/auth");

/* GET home page. */
router.get("/", getUser, function (req, res, next) {
  res.send("Home, welcome");
});

module.exports = router;

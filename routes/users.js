var express = require("express");
var router = express.Router();
const {register, login} = require("../controllers/users");
const {requireAuth, getUser} = require("../middlewares/auth");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("users");
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;

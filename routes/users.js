const express = require("express");
const router = express.Router();
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const { isLoggedOut, isLoggedIn } = require("../middleware");
const users = require("../controllers/users");

router.get("/login", isLoggedOut, catchAsync(users.loginGet));
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  catchAsync(users.loginPost)
);
router.get("/register", isLoggedOut, catchAsync(users.registerGet));
router.post("/register", catchAsync(users.registerPost));
router.get("/logout", isLoggedIn, catchAsync(users.logout));

module.exports = router;

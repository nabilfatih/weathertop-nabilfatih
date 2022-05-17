const express = require("express");
const router = express.Router();
const passport = require("passport");
const request = require("request");
const { Pool, Client } = require("pg");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true,
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login | Weathertop",
    user: req.user,
  });
});

// router.post("/login");

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register | Weathertop",
    user: req.user,
  });
});

// router.post("/register");

router.get("/signout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("login");
});

module.exports = router;

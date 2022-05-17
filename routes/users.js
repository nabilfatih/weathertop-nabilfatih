const express = require("express");
const router = express.Router();
const passport = require("passport");
const request = require("request");
const { Pool, Client } = require("pg");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const catchAsync = require("../utils/catchAsync");
const { isLoggedOut } = require("../middleware");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true,
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", {
    title: "Login | Weathertop",
    user: req.user,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    req.flash("success", "Welcome to Weathertop!");
    const redirectUrl = req.session.returnTo || "/dashboard";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/register", isLoggedOut, (req, res) => {
  res.render("register", {
    title: "Register | Weathertop",
    user: req.user,
  });
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("error", "Password not match!");
      res.redirect("/register");
      return;
    }

    try {
      const client = await pool.connect();
      await client.query("BEGIN");
      var pwd = await bcrypt.hash(password, 12);
      await JSON.stringify(
        client.query(
          "SELECT id FROM users WHERE username=$1",
          [username],
          function (err, result) {
            if (result.rows[0]) {
              req.flash("error", "This email address is already registered");
              res.redirect("/register");
            } else {
              client.query(
                "INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
                [uuid(), name, username, email, pwd],
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    client.query("COMMIT");
                    console.log(result);
                    req.flash("success", "User created");
                    res.redirect("/login");
                    return;
                  }
                }
              );
            }
          }
        )
      );
      client.release();
    } catch (err) {
      throw err;
    }
  })
);

router.get("/signout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("login");
});

module.exports = router;

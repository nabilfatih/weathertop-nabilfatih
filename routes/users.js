const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uuid } = require("uuidv4");
const bcrypt = require("bcrypt");

const catchAsync = require("../utils/catchAsync");
const { isLoggedOut } = require("../middleware");
const dataStore = require("../models/data-store");

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
      const client = await dataStore.getDataStore();
      JSON.stringify(
        await client.query(
          "SELECT * FROM users WHERE username=$1",
          [username],
          async function (err, result) {
            const pwd = await bcrypt.hash(password, 10);
            if (result.rows[0]) {
              req.flash("error", "This email address is already registered");
              res.redirect("/register");
            } else {
              await client.query(
                "INSERT INTO users (id, name, username, email, password) VALUES ($1, $2, $3, $4, $5)",
                [uuid(), name, username, email, pwd],
                function (err, result) {
                  if (err) {
                    req.flash("error", "Error created the account!");
                    res.redirect("/register");
                    return;
                  } else {
                    client.query("COMMIT");
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
    } catch (err) {
      throw err;
    }
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/login");
});

module.exports = router;

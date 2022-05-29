const dataStore = require("../models/data-store");
const { uuid } = require("uuidv4");
const bcrypt = require("bcrypt");

const users = {
  async registerPost(req, res) {
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
  },

  async registerGet(req, res) {
    res.render("register", {
      title: "Register | Weathertop",
      user: req.user,
    });
  },

  async login(req, username, password, done) {
    const client = await dataStore.getDataStore();
    try {
      JSON.stringify(
        await client.query(
          "SELECT id, name, username, email, password FROM users WHERE username=$1",
          [username],
          function (err, result) {
            if (err) {
              req.flash("error", "User not found!");
              return done(err);
            }
            if (result.rows[0] == null) {
              req.flash("error", "User not found!");
              return done(null, false);
            } else {
              bcrypt.compare(
                password,
                result.rows[0].password,
                function (err, check) {
                  if (err) {
                    req.flash("error", "Incorrect login details");
                    return done();
                  } else if (check) {
                    return done(null, {
                      userId: result.rows[0].id,
                      email: result.rows[0].email,
                      username: result.rows[0].username,
                    });
                  } else {
                    req.flash("error", "Wrong password!");
                    return done(null, false);
                  }
                }
              );
            }
          }
        )
      );
    } catch (e) {
      throw e;
    }
  },

  async loginPost(req, res) {
    req.flash("success", "Welcome to Weathertop!");
    const redirectUrl = req.session.returnTo || "/dashboard";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  },

  async loginGet(req, res) {
    res.render("login", {
      title: "Login | Weathertop",
      user: req.user,
    });
  },

  async logout(req, res) {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/login");
  },
};

module.exports = users;

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const handlebars = require("express-handlebars");
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const logger = require("./utils/logger");
const ExpressError = require("./utils/ExpressError");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(expressSanitizer());

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const routes = require("./routes");
app.use("/", routes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Halaman Tidak Ditemukan :(", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No! Something went wrong!";
  res.status(statusCode).render("error", { err, user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Web App template listening on ${process.env.PORT}`);
});

module.exports = app;

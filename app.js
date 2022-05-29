const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");

const ExpressError = require("./utils/ExpressError");

const userRoutes = require("./routes/users");
const homeRoutes = require("./routes/home");
const dashboardRoutes = require("./routes/dashboard");
const cityRoutes = require("./routes/city");
const { isLoggedOut } = require("./middleware");
const users = require("./controllers/users");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
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

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      users.login(req, username, password, done);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/home", homeRoutes);
app.use("/city", cityRoutes);

app.get("/", isLoggedOut, (req, res) => {
  res.render("index", {
    title: "Weathertop",
    header: "Welcome to Weathertop!",
  });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found :(", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No! Something went wrong!";
  res.status(statusCode).render("error", { err, user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Weathertop listening on ${process.env.PORT}`);
});

module.exports = app;

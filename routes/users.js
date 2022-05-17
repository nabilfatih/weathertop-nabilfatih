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

router.get("/login");
router.post("/login");
router.get("/signup");
router.post("/signup");
router.get("/signout");

module.exports = router;

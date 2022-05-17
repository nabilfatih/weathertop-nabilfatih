const express = require("express");
const router = express.Router();

const home = require("../controllers/home.js");
const { isLoggedOut } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/", isLoggedOut, catchAsync(home.index));

module.exports = router;

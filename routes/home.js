const express = require("express");
const router = express.Router();

const home = require("../controllers/home.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/", catchAsync(home.index));

module.exports = router;

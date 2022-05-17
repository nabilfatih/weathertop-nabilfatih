const express = require("express");
const router = express.Router();

const dashboard = require("../controllers/dashboard.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/", catchAsync(dashboard.index));

module.exports = router;

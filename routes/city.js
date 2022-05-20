const express = require("express");
const router = express.Router();

const city = require("../controllers/city.js");
const { isLoggedIn } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/:param_city", isLoggedIn, catchAsync(city.index));
router.post("/:city/add", isLoggedIn, catchAsync(city.add));
router.post("/:city/delete", isLoggedIn, catchAsync(city.delete));

module.exports = router;

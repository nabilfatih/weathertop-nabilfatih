const express = require("express");
const router = express.Router();

const city = require("../controllers/city.js");
const { isLoggedIn } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/city/:city", isLoggedIn, catchAsync(city.city));
router.post("/city/:city/:id/add", isLoggedIn, catchAsync(city.add));
router.post("/city:city/:id/delete", isLoggedIn, catchAsync(city.delete));

module.exports = router;

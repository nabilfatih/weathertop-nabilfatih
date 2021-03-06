const express = require("express");
const router = express.Router();

const dashboard = require("../controllers/dashboard.js");
const { isLoggedIn } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync.js");

router.get("/", isLoggedIn, catchAsync(dashboard.index));
router.post("/", isLoggedIn, catchAsync(dashboard.add));
router.get("/:param_city/delete", isLoggedIn, catchAsync(dashboard.delete));

module.exports = router;

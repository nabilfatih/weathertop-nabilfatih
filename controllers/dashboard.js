const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");

const dashboard = {
  async index(req, res) {
    logger.info("Dashboard rendering");
    const username = req.user.username;
    const cityList = await cityStore.getUserCity(username);

    const viewData = {
      title: "Dashboard",
      user: req.user,
      cityList,
    };
    res.render("dashboard", viewData);
  },

  async add(req, res) {
    logger.info("dashboard rendering");
    const username = req.user.username;
    const { city, latitude, longitude } = req.body;
    await cityStore.addCity(username, city, latitude, longitude);
    req.flash("success", "City added!");
    res.redirect("/dashboard");
  },
};

module.exports = dashboard;

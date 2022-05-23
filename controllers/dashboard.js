const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");

const dashboard = {
  async index(req, res) {
    logger.info("Dashboard rendering");
    const username = req.user.username;
    const cityList = await cityStore.getUserCity(username);

    const viewData = {
      title: "Dashboard | Weathertop",
      user: req.user,
      cityList,
    };
    res.render("dashboard", viewData);
  },

  async add(req, res) {
    const username = req.user.username;
    const { city, latitude, longitude } = req.body;
    const result = await cityStore.addCity(username, city, latitude, longitude);

    if (result === null) {
      req.flash("error", "City not found!");
      return res.redirect("/dashboard");
    }

    if (result?.length) {
      req.flash("error", "City already added!");
      return res.redirect("/dashboard");
    }

    req.flash("success", "City added!");
    res.redirect("/dashboard");
  },

  async delete(req, res) {
    const username = req.user.username;
    const { param_city } = req.params;
    await cityStore.removeCity(param_city, username);
    req.flash("success", "City deleted!");
    res.redirect("/dashboard");
  },
};

module.exports = dashboard;

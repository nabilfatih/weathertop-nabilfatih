const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");

const city = {
  async index(req, res) {
    logger.info("Dashboard rendering");
    const username = req.user.username;
    const { param_city } = req.params;
    const cityList = await cityStore.getUserOneCity(param_city, username);

    console.log(cityList);

    const viewData = {
      title: "City",
      user: req.user,
      cityList,
    };
    res.render("city", viewData);
  },

  async add(req, res) {
    logger.info("city rendering");

    const viewData = {
      title: "city",
      user: req.user,
    };
    res.render("city", viewData);
  },

  async delete(req, res) {
    logger.info("city rendering");

    const viewData = {
      title: "city",
      user: req.user,
    };
    res.render("city", viewData);
  },
};

module.exports = city;

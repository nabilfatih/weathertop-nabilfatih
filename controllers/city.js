const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");
const weatherStore = require("../models/weather-store.js");

const city = {
  async index(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city } = req.params;
    const cityList = await cityStore.getUserOneCity(param_city, username);
    const weatherList = await weatherStore.getUserWeather(param_city, username);

    const viewData = {
      title: "City",
      user: req.user,
      weatherList,
      param_city: param_city,
      cityList,
    };
    res.render("city", viewData);
  },

  async add(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city } = req.params;
    const { code, temperature, windSpeed, windDirection, airPressure } =
      req.body;

    if (code <= 0 || windDirection <= 0 || windSpeed <= 0 || airPressure <= 0) {
      req.flash("error", "Failed add weather!");
      return res.redirect(`/city/${param_city}`);
    }

    const result = await weatherStore.addWeather(
      param_city,
      username,
      code,
      temperature,
      windSpeed,
      windDirection,
      airPressure
    );

    req.flash("success", "City added!");
    res.redirect(`/city/${param_city}`);
  },

  async delete(req, res) {
    logger.info("city rendering");
  },
};

module.exports = city;

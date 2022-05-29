const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");
const weatherStore = require("../models/weather-store.js");
const converter = require("../utils/converter.js");
const call = require("../utils/weatherCall.js");

const city = {
  async index(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city } = req.params;
    const cityList = await cityStore.getUserOneCity(param_city, username);
    const weatherList = await weatherStore.getUserWeather(param_city, username);

    const viewData = {
      title: "City | Weathertop",
      header: "City",
      user: req.user,
      weatherList,
      param_city: param_city,
      cityList,
    };
    res.render("city", viewData);
  },

  async autoAdd(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city } = req.params;

    try {
      const data = await call.weather(param_city, process.env.WEATHER_API_KEY);

      const weatherMain = data.weather.reduce(() => ({}));
      const icon = converter.icon(weatherMain.id.toString());
      const deg = converter.compass(data.wind.deg);

      await weatherStore.autoAddWeather(
        param_city,
        username,
        data,
        weatherMain,
        icon,
        deg
      );
      req.flash("success", "Automatic measurement added!");
      return res.redirect(`/city/${param_city}`);
    } catch (e) {
      req.flash("error", "Automatic measurement failed added!");
      return res.redirect(`/city/${param_city}`);
    }
  },

  async add(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city } = req.params;
    const { code, temperature, windSpeed, windDirection, airPressure } =
      req.body;

    if (
      code <= 0 ||
      windDirection <= 0 ||
      windDirection >= 360 ||
      windSpeed <= 0 ||
      airPressure <= 0
    ) {
      req.flash("error", "Failed add the measurement!");
      return res.redirect(`/city/${param_city}`);
    }

    const icon = converter.icon(code.toString());
    const deg = converter.compass(windDirection);

    try {
      await weatherStore.addWeather(
        param_city,
        username,
        icon,
        temperature,
        windSpeed,
        deg,
        airPressure,
        code
      );

      req.flash("success", "Weather added!");
      return res.redirect(`/city/${param_city}`);
    } catch (e) {
      req.flash("error", "Weather failed added!");
      return res.redirect(`/city/${param_city}`);
    }
  },

  async delete(req, res) {
    logger.info("Weather rendering");
    const username = req.user.username;
    const { param_city, id } = req.params;

    const result = await weatherStore.removeWeather(param_city, id, username);

    if (!result) {
      req.flash("error", "Can't delete more weather!");
      return res.redirect(`/city/${param_city}`);
    }

    req.flash("success", "Weather deleted!");
    res.redirect(`/city/${param_city}`);
  },
};

module.exports = city;

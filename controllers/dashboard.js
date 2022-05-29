const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");
const axios = require("axios");
const converter = require("../utils/converter.js");

const dashboard = {
  async index(req, res) {
    logger.info("Dashboard rendering");
    const username = req.user.username;
    const cityList = await cityStore.getUserCity(username);

    const viewData = {
      title: "Dashboard | Weathertop",
      header: "Dashboard",
      user: req.user,
      cityList,
    };
    res.render("dashboard", viewData);
  },

  async add(req, res) {
    const username = req.user.username;
    const { city, latitude, longitude } = req.body;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
      config
    );
    const weatherMain = data.weather.reduce(() => ({}));
    const icon = converter.icon(weatherMain.id.toString());
    const deg = converter.compass(data.wind.deg);
    const cond_air = converter.conditionAir(data.main.pressure);
    const cond_temp = converter.conditionTemp(data.main.temp);
    const cond_wind = converter.conditionWind(data.wind.speed);

    const result = await cityStore.addCity(
      username,
      city.toLowerCase(),
      data,
      deg,
      icon,
      cond_temp,
      cond_wind,
      cond_air,
      weatherMain
    );

    if (result === null) {
      req.flash("error", "City not found!");
      return res.redirect("/dashboard");
    }

    if (result?.length) {
      req.flash("error", "City already added!");
      return res.redirect("/dashboard");
    }

    req.flash("success", "City added!");
    return res.redirect("/dashboard");
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

const logger = require("../utils/logger.js");
const cityStore = require("../models/city-store");
const converter = require("../utils/converter.js");
const call = require("../utils/weatherCall.js");
const city = require("./city.js");

const dashboard = {
  async index(req, res) {
    logger.info("Dashboard rendering");
    const username = req.user.username;
    const cityList = await cityStore.getUserCity(username);

    const dataCoor = cityList.map((city) => {
      return Object.values({
        lat: Number(city.latitude),
        long: Number(city.longitude),
      });
    });
    const dataCity = cityList.map((city) => {
      return city.city;
    });

    const dataMap = cityList.map((list) => ({
      city: list.city,
      url: `/city/${list.city.toLowerCase()}`,
      latitude: list.latitude,
      longitude: list.longitude,
    }));

    console.log(dataMap);

    const viewData = {
      title: "Dashboard | Weathertop",
      header: "Dashboard",
      user: req.user,
      cityList,
      dataCoor,
      dataCity,
      dataMap,
    };

    res.render("dashboard", viewData);
  },

  async add(req, res) {
    const username = req.user.username;
    const { city, latitude, longitude } = req.body;

    try {
      const data = await call.weather(city, process.env.WEATHER_API_KEY);

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

      if (result?.length) {
        req.flash("error", "City already added!");
        return res.redirect("/dashboard");
      }

      req.flash("success", "City added!");
      return res.redirect("/dashboard");
    } catch (e) {
      req.flash("error", "City not found!");
      return res.redirect("/dashboard");
    }
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

const axios = require("axios");
const { uuid } = require("uuidv4");

const dataStore = require("./data-store.js");
const logger = require("../utils/logger.js");
const { data } = require("../utils/logger.js");

const weatherStore = {
  async getUserWeather(param_city, username) {
    const query =
      "SELECT * FROM weather_list WHERE param_city=$1 AND username=$2 ORDER BY added DESC";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching list of weather:", e);
    }
  },

  async removeWeather(param_weather, username) {
    const query =
      "DELETE FROM weather_list WHERE param_weather=$1 AND username=$2";
    const values = [param_weather, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Unable to remove weather:", e);
    }
  },

  async updateWeather(param_weather, username) {
    const query =
      "DELETE FROM weather_list WHERE param_weather=$1 AND username=$2";
    const values = [param_weather, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Unable to remove weather:", e);
    }
  },

  async addWeather(
    param_city,
    username,
    code,
    temperature,
    windSpeed,
    windDirection,
    airPressure
  ) {
    let icon;
    if (code == "800") {
      icon = "clear";
    } else {
      switch (code.charAt(0)) {
        case "2":
          icon = "thunderstorm";
          break;
        case "3":
          icon = "drizzle";
          break;
        case "5":
          icon = "rain";
          break;
        case "6":
          icon = "snow";
          break;
        case "7":
          icon = "atmosphere";
          break;
        case "8":
          icon = "clouds";
          break;
        default:
          icon = "clear";
      }
    }

    let deg;
    switch (true) {
      case windDirection >= 348.75 && windDirection <= 11.25:
        deg = "North";
        break;
      case windDirection >= 11.25 && windDirection <= 33.75:
        deg = "North North East";
        break;
      case windDirection >= 33.75 && windDirection <= 56.25:
        deg = "North East";
        break;
      case windDirection >= 56.25 && windDirection <= 78.75:
        deg = "East North East";
        break;
      case windDirection >= 78.75 && windDirection <= 101.25:
        deg = "East";
        break;
      case windDirection >= 101.25 && windDirection <= 123.75:
        deg = "East South East";
        break;
      case windDirection >= 123.75 && windDirection <= 146.25:
        deg = "South East";
        break;
      case windDirection >= 146.25 && windDirection <= 168.75:
        deg = "South South East";
        break;
      case windDirection >= 168.75 && windDirection <= 191.25:
        deg = "South";
        break;
      case windDirection >= 191.25 && windDirection <= 213.75:
        deg = "South South West";
        break;
      case windDirection >= 213.75 && windDirection <= 236.25:
        deg = "South West";
        break;
      case windDirection >= 236.25 && windDirection <= 258.75:
        deg = "West South West";
        break;
      case windDirection >= 258.75 && windDirection <= 281.25:
        deg = "West";
        break;
      case windDirection >= 281.25 && windDirection <= 303.75:
        deg = "West North West";
        break;
      case windDirection >= 303.75 && windDirection <= 326.25:
        deg = "North West";
        break;
      case windDirection >= 326.25 && windDirection <= 348.75:
        deg = "North North West";
        break;
    }

    const dataStoreClient = await dataStore.getDataStore();

    try {
      const query =
        "INSERT INTO weather_list (id, username, param_city, added, time, weather, icon, temp, wind, wind_direction, air_pressure) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
      const values = [
        uuid(),
        username,
        param_city,
        new Date(),
        Date(Date.now()).toString(),
        code,
        icon,
        temperature,
        windSpeed,
        deg,
        airPressure,
      ];
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Error cannot add weather:", e);
      throw e;
    }
  },
};

module.exports = weatherStore;

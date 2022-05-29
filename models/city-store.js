const axios = require("axios");
const { uuid } = require("uuidv4");

const dataStore = require("./data-store.js");
const logger = require("../utils/logger.js");
const weatherStore = require("./weather-store");

const cityStore = {
  async getUserCity(username) {
    const query =
      "SELECT * FROM city_list WHERE username=$1 ORDER BY added DESC";
    const values = [username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching list of city:", e);
    }
  },

  async getUserOneCity(param_city, username) {
    const query = "SELECT * FROM city_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching city:", e);
    }
  },

  async checkCity(param_city, username) {
    const query = "SELECT * FROM city_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching city:", e);
    }
  },

  async removeCity(param_city, username) {
    const query = "DELETE FROM city_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Unable to remove city:", e);
    }

    try {
      await weatherStore.removeAllWeather(param_city, username);
    } catch (e) {
      logger.error("Unable to remove all weather city:", e);
    }
  },

  async addCity(
    username,
    city,
    data,
    deg,
    icon,
    cond_temp,
    cond_wind,
    cond_air,
    weatherMain
  ) {
    const checkData = await this.checkCity(city, username);

    if (checkData.length) {
      return checkData;
    } else {
      const dataStoreClient = await dataStore.getDataStore();

      let windSpeedMax = null;
      let windSpeedMin = null;
      let airPressureMax = null;
      let airPressureMin = null;

      console.log(weatherMain);

      try {
        const query =
          "INSERT INTO city_list (id, added, param_city, username, city, latitude, longitude, weather, icon, temp, temp_max, temp_min, wind_speed, degree, wind_speed_max, wind_speed_min, air_pressure, air_pressure_max, air_pressure_min, cond_temp, cond_wind, cond_air) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)";
        const values = [
          uuid(),
          new Date(),
          data.name.toLowerCase(),
          username,
          data.name,
          data.coord.lat,
          data.coord.lon,
          weatherMain.main,
          icon,
          data.main.temp,
          data.main.temp_max,
          data.main.temp_min,
          data.wind.speed,
          deg,
          windSpeedMax,
          windSpeedMin,
          data.main.pressure,
          airPressureMax,
          airPressureMin,
          cond_temp,
          cond_wind,
          cond_air,
        ];
        await dataStoreClient.query(query, values);
      } catch (e) {
        logger.error("Error cannot add city:", e);
        throw e;
      }

      try {
        await weatherStore.addWeather(
          data.name.toLowerCase(),
          username,
          icon,
          data.main.temp,
          data.wind.speed,
          deg,
          data.main.pressure,
          weatherMain.id
        );
      } catch (e) {
        logger.error("Error cannot add weather:", e);
        throw e;
      }
    }
  },
};

module.exports = cityStore;

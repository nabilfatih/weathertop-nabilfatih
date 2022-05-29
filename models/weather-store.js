const { uuid } = require("uuidv4");
const axios = require("axios");

const dataStore = require("./data-store");
const logger = require("../utils/logger.js");
const converter = require("../utils/converter");

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

  async removeAllWeather(param_city, username) {
    const query =
      "DELETE FROM weather_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Unable to remove all weather:", e);
    }
  },

  async removeWeather(param_city, id, username) {
    const result = await this.getUserWeather(param_city, username);

    if (result.length <= 2) {
      return null;
    }

    const dataStoreClient = await dataStore.getDataStore();
    try {
      let query = "DELETE FROM weather_list WHERE id=$1 AND username=$2";
      let values = [id, username];
      await dataStoreClient.query(query, values);

      let rows = await this.getUserWeather(param_city, username);
      let data = rows[0];

      await this.updateWeather(
        data.weather,
        data.icon,
        data.temp,
        data.wind_direction,
        data.wind,
        data.air_pressure,
        param_city,
        username
      );

      return true;
    } catch (e) {
      logger.error("Unable to remove weather:", e);
      throw e;
    }
  },

  async getAirPressure(param_city, username) {
    const query =
      "SELECT air_pressure FROM weather_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching city air pressure:", e);
    }
  },

  async getTemperature(param_city, username) {
    const query =
      "SELECT temp FROM weather_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching city temperature:", e);
    }
  },

  async getWindSpeed(param_city, username) {
    const query =
      "SELECT wind FROM weather_list WHERE param_city=$1 AND username=$2";
    const values = [param_city, username];
    const dataStoreClient = await dataStore.getDataStore();
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching city wind speed:", e);
    }
  },

  async updateWeather(
    code,
    icon,
    temperature,
    deg,
    windSpeed,
    airPressure,
    param_city,
    username
  ) {
    try {
      const weather = converter.weather(code.toString());

      const tempList = await this.getTemperature(param_city, username);
      const windList = await this.getWindSpeed(param_city, username);
      const airPressureList = await this.getAirPressure(param_city, username);

      const cond_temp = converter.conditionTemp(temperature);
      const cond_wind = converter.conditionWind(windSpeed);
      const cond_air = converter.conditionAir(airPressure);

      const dataStoreClient = await dataStore.getDataStore();

      if (
        tempList.length > 1 &&
        windList.length > 1 &&
        airPressureList.length > 1
      ) {
        const arrTemp = tempList.map(Object.values);
        let tempMin = Math.min(...arrTemp);
        let tempMax = Math.max(...arrTemp);

        const arrWind = windList.map(Object.values);
        let windMin = Math.min(...arrWind);
        let windMax = Math.max(...arrWind);

        const arrAirPressure = airPressureList.map(Object.values);
        let airMin = Math.min(...arrAirPressure);
        let airMax = Math.max(...arrAirPressure);

        const query =
          "UPDATE city_list SET weather=$1, icon=$2, temp=$3, temp_max=$4, temp_min=$5, degree=$6, wind_speed=$7, wind_speed_max=$8, wind_speed_min=$9, air_pressure=$10, air_pressure_max=$11, air_pressure_min=$12, cond_temp=$13, cond_wind=$14, cond_air=$15 WHERE param_city=$16 AND username=$17";
        const values = [
          weather,
          icon,
          temperature,
          tempMax,
          tempMin,
          deg,
          windSpeed,
          windMax,
          windMin,
          airPressure,
          airMax,
          airMin,
          cond_temp,
          cond_wind,
          cond_air,
          param_city,
          username,
        ];
        try {
          await dataStoreClient.query(query, values);
        } catch (e) {
          logger.error("Error updating city", e);
        }
      } else {
        const query =
          "UPDATE city_list SET weather=$1, icon=$2, temp=$3, degree=$4, wind_speed=$5, air_pressure=$6, cond_temp=$7, cond_wind=$8, cond_air=$9 WHERE param_city=$10 AND username=$11";
        const values = [
          weather,
          icon,
          temperature,
          deg,
          windSpeed,
          airPressure,
          cond_temp,
          cond_wind,
          cond_air,
          param_city,
          username,
        ];
        try {
          await dataStoreClient.query(query, values);
        } catch (e) {
          logger.error("Error updating city", e);
        }
      }
    } catch (e) {
      logger.error("Error cannot update city:", e);
      throw e;
    }
  },

  async addWeather(
    param_city,
    username,
    icon,
    temperature,
    windSpeed,
    deg,
    airPressure,
    code
  ) {
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

      await this.updateWeather(
        code,
        icon,
        temperature,
        deg,
        windSpeed,
        airPressure,
        param_city,
        username
      );
    } catch (e) {
      logger.error("Error cannot add weather:", e);
      throw e;
    }
  },

  async autoAddWeather(param_city, username, data, weatherMain, icon, deg) {
    try {
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
          weatherMain.id.toString(),
          icon,
          data.main.temp,
          data.wind.speed,
          deg,
          data.main.pressure,
        ];
        await dataStoreClient.query(query, values);
      } catch (e) {
        logger.error("Error cannot add weather:", e);
        throw e;
      }

      await this.updateWeather(
        weatherMain.id.toString(),
        icon,
        data.main.temp,
        deg,
        data.wind.speed,
        data.main.pressure,
        param_city,
        username
      );
    } catch (e) {
      throw e;
    }
  },
};

module.exports = weatherStore;

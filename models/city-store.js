const axios = require("axios");
const { uuid } = require("uuidv4");

const dataStore = require("./data-store.js");
const logger = require("../utils/logger.js");

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
      logger.error("Error fetching playlist", e);
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
      logger.error("Error fetching playlist", e);
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
      logger.error("Error fetching playlist", e);
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
  },

  async addCity(username, city, latitude, longitude) {
    let param_city = city.toLowerCase();
    const checkData = await this.checkCity(param_city, username);

    if (checkData.length) {
      return checkData;
    } else {
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

      console.log(weatherMain);

      let icon;

      if (weatherMain.id.toString() == "800") {
        icon = "clear";
      } else {
        switch (weatherMain.id.toString().charAt(0)) {
          case "2":
            icon = "thunderstorm";
            break;
          case "3":
            text = "drizzle";
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

      const dataStoreClient = await dataStore.getDataStore();

      let windSpeedMax = 2;
      let windSpeedMin = 2;
      let airPressureMax = 2;
      let airPressureMin = 2;

      try {
        const query =
          "INSERT INTO city_list (id, added, param_city, username, city, latitude, longitude, weather, icon, temp, temp_max, temp_min, wind_speed, degree, wind_speed_max, wind_speed_min, air_pressure, air_pressure_max, air_pressure_min) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)";
        const values = [
          uuid(),
          new Date(),
          city.toLowerCase(),
          username,
          city,
          data.coord.lat,
          data.coord.lon,
          weatherMain.main,
          icon,
          data.main.temp,
          data.main.temp_max,
          data.main.temp_min,
          data.wind.speed,
          data.wind.deg,
          windSpeedMax,
          windSpeedMin,
          data.main.pressure,
          airPressureMax,
          airPressureMin,
        ];
        await dataStoreClient.query(query, values);
      } catch (e) {
        logger.error("Error cannot add city", e);
      }
    }
  },
};

module.exports = cityStore;

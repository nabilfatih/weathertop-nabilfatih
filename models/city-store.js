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

      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`,
          config
        );

        console.log(data);

        const weatherMain = data.weather.reduce(() => ({}));

        let icon;
        if (weatherMain.id.toString() == "800") {
          icon = "clear";
        } else {
          switch (weatherMain.id.toString().charAt(0)) {
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
          case data.wind.deg >= 348.75 && data.wind.deg <= 360:
            deg = "North";
            break;
          case data.wind.deg >= 0 && data.wind.deg <= 11.25:
            deg = "North";
            break;
          case data.wind.deg >= 11.25 && data.wind.deg <= 33.75:
            deg = "North North East";
            break;
          case data.wind.deg >= 33.75 && data.wind.deg <= 56.25:
            deg = "North East";
            break;
          case data.wind.deg >= 56.25 && data.wind.deg <= 78.75:
            deg = "East North East";
            break;
          case data.wind.deg >= 78.75 && data.wind.deg <= 101.25:
            deg = "East";
            break;
          case data.wind.deg >= 101.25 && data.wind.deg <= 123.75:
            deg = "East South East";
            break;
          case data.wind.deg >= 123.75 && data.wind.deg <= 146.25:
            deg = "South East";
            break;
          case data.wind.deg >= 146.25 && data.wind.deg <= 168.75:
            deg = "South South East";
            break;
          case data.wind.deg >= 168.75 && data.wind.deg <= 191.25:
            deg = "South";
            break;
          case data.wind.deg >= 191.25 && data.wind.deg <= 213.75:
            deg = "South South West";
            break;
          case data.wind.deg >= 213.75 && data.wind.deg <= 236.25:
            deg = "South West";
            break;
          case data.wind.deg >= 236.25 && data.wind.deg <= 258.75:
            deg = "West South West";
            break;
          case data.wind.deg >= 258.75 && data.wind.deg <= 281.25:
            deg = "West";
            break;
          case data.wind.deg >= 281.25 && data.wind.deg <= 303.75:
            deg = "West North West";
            break;
          case data.wind.deg >= 303.75 && data.wind.deg <= 326.25:
            deg = "North West";
            break;
          case data.wind.deg >= 326.25 && data.wind.deg <= 348.75:
            deg = "North North West";
            break;
        }

        const dataStoreClient = await dataStore.getDataStore();

        let windSpeedMax = null;
        let windSpeedMin = null;
        let airPressureMax = null;
        let airPressureMin = null;

        try {
          const query =
            "INSERT INTO city_list (id, added, param_city, username, city, latitude, longitude, weather, icon, temp, temp_max, temp_min, wind_speed, degree, wind_speed_max, wind_speed_min, air_pressure, air_pressure_max, air_pressure_min) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)";
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
            weatherMain.id.toString(),
            data.main.temp,
            data.wind.speed,
            data.wind.deg,
            data.main.pressure
          );
        } catch (e) {
          logger.error("Error cannot add weather:", e);
          throw e;
        }
      } catch (e) {
        return null;
      }
    }
  },
};

module.exports = cityStore;

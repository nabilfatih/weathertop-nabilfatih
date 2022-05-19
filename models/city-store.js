const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const cityStore = {
  async getUserCity(username) {
    const query = "SELECT * FROM city_list WHERE username=$1";
    const values = [username];
    try {
      let result = await dataStoreClient.query(query, values);
      return result.rows;
    } catch (e) {
      logger.error("Error fetching playlist", e);
    }
  },

  async removeCity(city, username) {
    const query = "DELETE FROM city_list WHERE city=$1 AND username=$2";
    const values = [city, username];
    try {
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Unable to remove city:", e);
    }
  },
  async addCity(user_id, city, latitude, longitude) {
    try {
      const query =
        "INSERT INTO city_list (user_id, city, latitude, longitude) VALUES($1, $2, $3, $4)";
      const values = [user_id, city, latitude, longitude];
      await dataStoreClient.query(query, values);
    } catch (e) {
      logger.error("Error cannot add city", e);
    }
  },
};

module.exports = cityStore;

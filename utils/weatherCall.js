const axios = require("axios");

const call = {
  async weather(city, id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${id}&units=metric`,
      config
    );
    return data;
  },
};

module.exports = call;

const logger = require("../utils/logger.js");

const home = {
  index(request, response) {
    logger.info("Home rendering");
    const viewData = {
      title: "Welcome to the Weathertop"
    };
    response.render("index", viewData);
  },
};

module.exports = home;

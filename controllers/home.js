const logger = require("../utils/logger.js");

const home = {
  index(req, res) {
    logger.info("Home rendering");
    const viewData = {
      title: "Welcome to the Weathertop!",
    };
    res.render("index", viewData);
  },
};

module.exports = home;

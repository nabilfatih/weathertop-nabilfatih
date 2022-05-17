const logger = require("../utils/logger.js");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");
    const viewData = {
      title: "Dashboard",
    };
    response.render("dashboard", viewData);
  },
};

module.exports = dashboard;

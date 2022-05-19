const logger = require("../utils/logger.js");

const dashboard = {
  index(req, res) {
    logger.info("dashboard rendering");

    const viewData = {
      title: "Dashboard",
      user: req.user,
    };
    res.render("dashboard", viewData);
  },
};

module.exports = dashboard;

const logger = require("../utils/logger.js");

const city = {
  async city(req, res) {
    logger.info("city rendering");

    const viewData = {
      title: "City",
      user: req.user,
    };
    res.render("city", viewData);
  },

  async add(req, res) {
    logger.info("city rendering");

    const viewData = {
      title: "city",
      user: req.user,
    };
    res.render("city", viewData);
  },

  async delete(req, res) {
    logger.info("city rendering");

    const viewData = {
      title: "city",
      user: req.user,
    };
    res.render("city", viewData);
  },
};

module.exports = city;

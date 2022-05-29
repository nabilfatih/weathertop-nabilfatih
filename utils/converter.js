const converter = {
  compass(degree) {
    let deg;
    switch (true) {
      case degree >= 348.75 && degree <= 360:
        deg = "North";
        break;
      case degree >= 0 && degree <= 11.25:
        deg = "North";
        break;
      case degree >= 11.25 && degree <= 33.75:
        deg = "North North East";
        break;
      case degree >= 33.75 && degree <= 56.25:
        deg = "North East";
        break;
      case degree >= 56.25 && degree <= 78.75:
        deg = "East North East";
        break;
      case degree >= 78.75 && degree <= 101.25:
        deg = "East";
        break;
      case degree >= 101.25 && degree <= 123.75:
        deg = "East South East";
        break;
      case degree >= 123.75 && degree <= 146.25:
        deg = "South East";
        break;
      case degree >= 146.25 && degree <= 168.75:
        deg = "South South East";
        break;
      case degree >= 168.75 && degree <= 191.25:
        deg = "South";
        break;
      case degree >= 191.25 && degree <= 213.75:
        deg = "South South West";
        break;
      case degree >= 213.75 && degree <= 236.25:
        deg = "South West";
        break;
      case degree >= 236.25 && degree <= 258.75:
        deg = "West South West";
        break;
      case degree >= 258.75 && degree <= 281.25:
        deg = "West";
        break;
      case degree >= 281.25 && degree <= 303.75:
        deg = "West North West";
        break;
      case degree >= 303.75 && degree <= 326.25:
        deg = "North West";
        break;
      case degree >= 326.25 && degree <= 348.75:
        deg = "North North West";
        break;
    }
    return deg;
  },

  icon(code) {
    let icon;
    if (code == "800") {
      icon = "clear";
    } else {
      switch (code.charAt(0)) {
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
    return icon;
  },

  weather(code) {
    let weather;
    if (code == "800") {
      weather = "Clear";
    } else {
      switch (code.charAt(0)) {
        case "2":
          weather = "Thunderstorm";
          break;
        case "3":
          weather = "Drizzle";
          break;
        case "5":
          weather = "Rain";
          break;
        case "6":
          weather = "Snow";
          break;
        case "7":
          weather = "Atmosphere";
          break;
        case "8":
          weather = "Clouds";
          break;
        default:
          weather = "Clear";
      }
    }
    return weather;
  },

  conditionTemp(data) {
    let cond_temp;
    if (data >= 20) {
      cond_temp = "up";
    } else {
      cond_temp = "down";
    }
    return cond_temp;
  },

  conditionWind(data) {
    let cond_wind;
    if (data >= 5) {
      cond_wind = "up";
    } else {
      cond_wind = "down";
    }
    return cond_wind;
  },

  conditionAir(data) {
    let cond_air;
    if (data >= 1000) {
      cond_air = "up";
    } else {
      cond_air = "down";
    }
    return cond_air;
  },
};

module.exports = converter;

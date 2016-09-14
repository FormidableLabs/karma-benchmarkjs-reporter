"use strict";

var chalk = require("chalk");

var formatWithColorConfig = function (string, benchConfig) {
  return !benchConfig.colors
    ? chalk.stripColor(string)
    : string;
};

module.exports = {
  formatWithColorConfig: formatWithColorConfig
};

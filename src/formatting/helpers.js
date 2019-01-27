"use strict";

var stripAnsi = require("strip-ansi");

var formatWithColorConfig = function (string, benchConfig) {
  return !benchConfig.colors ? stripAnsi(string) : string;
};

module.exports = {
  formatWithColorConfig: formatWithColorConfig
};

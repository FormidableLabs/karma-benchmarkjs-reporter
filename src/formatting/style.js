"use strict";

var chalk = require("chalk");

module.exports = {
  benchmark: chalk.stripColor,
  summaryBenchmark: chalk.underline,
  summaryEmphasis: chalk.bold.underline,
  browser: chalk.blue,
  decorator: chalk.cyan,
  hz: chalk.green,
  hzUnits: chalk.italic.dim,
  suite: chalk.bold.magenta
};

"use strict";

var chalk = require("chalk");
var stripAnsi = require("strip-ansi");

module.exports = {
  benchmark: stripAnsi,
  summaryBenchmark: chalk.underline,
  summaryEmphasis: chalk.bold.underline,
  browser: chalk.blue,
  decorator: chalk.cyan,
  hz: chalk.green,
  hzUnits: chalk.italic.dim,
  suite: chalk.bold.magenta
};

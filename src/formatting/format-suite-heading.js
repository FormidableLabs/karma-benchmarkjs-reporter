"use strict";

var EOL = require("os").EOL;
var _ = require("lodash");
var formatWithColorConfig = require("./helpers").formatWithColorConfig;

/**
 * @param  {string} suiteName name of performance suite
 * @param  {number} terminalWidth target column width
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted suite name
 * @private
 */
var getFormattedSuiteName = function (suiteName, terminalWidth, style) {
  return style.suite(
    _.pad(suiteName, terminalWidth)
  );
};

/**
 * @param  {string} suiteName name of performance suite
 * @param  {Object} browser browser object
 * @param  {Object} benchConfig benchmarkReporter config object
 * @return {string} formatted suite heading
 */
var formatSuiteHeading = function (suiteName, browser, benchConfig) {
  var suiteHeading = getFormattedSuiteName(suiteName, benchConfig.terminalWidth, benchConfig.style);
  return formatWithColorConfig(EOL + suiteHeading + EOL, benchConfig);
};

module.exports = formatSuiteHeading;

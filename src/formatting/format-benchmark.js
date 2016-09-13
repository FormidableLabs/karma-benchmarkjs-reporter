"use strict";

var EOL = require("os").EOL;
var _ = require("lodash");
var stripAnsi = require("strip-ansi");

/**
 * @param  {string} decorator the decorator symbol e.g., "-"
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted decorator
 * @private
 */
var getFormattedDecorator = function (decorator, style) {
  return style.decorator(
    decorator + " "
  );
};

/**
 * @param  {number} hz the average ops/sec perf
 * @param  {number} hzWidth the target column width of the formatted string
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted hz
 * @private
 */
var getFormattedHz = function (hz, hzWidth, style) {
  return style.hz(
    _.padStart(Math.round(hz), hzWidth)
  );
};

/**
 * @param  {string} units the units of th hz (e.g., "ops/sec")
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted hz units
 * @private
 */
var getFormattedHzUnits = function (units, style) {
  return style.hzUnits(
    " " + units + " "
  );
};

/**
 * @param  {string} browserName the name of the browser
 * @param  {number} browserWidth the target width of the formatted browser name
 * @return {string} the formatted browser name
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @private
 */
var getFormattedBrowserName = function (browserName, browserWidth, style) {
  return style.browser(
    _.padStart("[" + browserName + "]", browserWidth)
  );
};

/**
 * @param  {string} benchmarkName the name of the benchmark
 * @param  {number} benchmarkWidth the target width of the formatted benchmark name
 * @param {Object} style style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted benchmark name
 * @private
 */
var getFormattedBenchmarkName = function (benchmarkName, benchmarkWidth, style) {
  return style.benchmark(
    _.padEnd(benchmarkName, benchmarkWidth)
  );
};

/**
 * @param  {number} terminalWidth the target width of an entire row
 * @param  {string[]} otherStringsInRow the other strings to appear in the row
 * @return {number} the remaining cols in the row
 * @private
 */
var getRemainingWidth = function (terminalWidth, otherStringsInRow) {
  var lengthOfOtherStringsInRow = stripAnsi(otherStringsInRow.join("")).length;

  return terminalWidth - lengthOfOtherStringsInRow;
};

/**
 * @param  {Object} benchmark the benchmark to be formatted
 * @param  {Object} browser the browser associated with the benchmark
 * @param  {Object} benchConfig the benchmarkReporter config obj
 * @return {string} the formatted benchmark
 */
var formatBenchmark = function (benchmark, browser, benchConfig) {
  var style = benchConfig.style;
  var decorator = getFormattedDecorator(benchConfig.decorator, style);
  var hz = getFormattedHz(benchmark.hz, benchConfig.hzWidth, style);
  var hzUnits = getFormattedHzUnits(benchConfig.hzUnits, style);
  var browserName = benchConfig.showBrowser
    ? getFormattedBrowserName(browser.name, benchConfig, style)
    : "";
  var benchmarkName = getFormattedBenchmarkName(
    benchmark.name,
    getRemainingWidth(benchConfig.terminalWidth, [
      decorator, hz, hzUnits, browserName
    ]),
    style
  );

  return decorator + benchmarkName + hz + hzUnits + browserName + EOL;
};

module.exports = formatBenchmark;

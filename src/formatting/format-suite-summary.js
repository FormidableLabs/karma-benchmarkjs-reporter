"use strict";

var EOL = require("os").EOL;
var _ = require("lodash");
var stripAnsi = require("strip-ansi");

/**
 * @param  {Object} fastest the fastest benchmark
 * @param {Object} secondFastest the second fastest benchmark
 * @param {Object} style style style object containing wrapper functions (e.g., chalk functions)
 * @return {string} formatted number of times as fast the fastest
 * benchmark ran compared to the second fastest.
 * @private
 */
var getFormattedTimesAsFast = function (fastest, secondFastest, style) {
  var PRECISION = 2;
  return style.summaryEmphasis(
    _.round(fastest.hz / secondFastest.hz, PRECISION)
  );
};

/**
 * @param  {string} benchmarkName the benchmark name
 * @param  {Object} style style style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted summarch benchmark
 * @private
 */
var getFormattedSummaryBenchmark = function (benchmarkName, style) {
  return style.summaryBenchmark(
    benchmarkName
  );
};

/**
 * @param  {Object[]} benchmarks array of benchmarks
 * @param  {Object} benchConfig benchmarkReporter config obj
 * @return {string} the formatted suite summary
 * @private
 */
var getFormattedSuiteSummary = function (benchmarks, benchConfig) {
  var style = benchConfig.style;

  var fastestBenchmarksDesc = _.orderBy(benchmarks, "hz", "desc");
  var fastest = fastestBenchmarksDesc[0];
  var secondFastest = fastestBenchmarksDesc[1];

  var fastestName = getFormattedSummaryBenchmark(fastest.name, style);
  var secondFastestName = getFormattedSummaryBenchmark(secondFastest.name, style);
  var timesAsFast = getFormattedTimesAsFast(fastest, secondFastest, style);

  var summary = fastestName + " was " + timesAsFast + " times as fast as " + secondFastestName;
  var widthwithOffset = benchConfig.terminalWidth + summary.length - stripAnsi(summary).length;

  return EOL + _.pad(summary, widthwithOffset) + EOL;
};

/**
 * @param  {Object[]} suite array of browserBenchmarks: `{browser: {Obj}, benchmark: {Obj}`
 * @return {Object} Object with arrays of benchmarks by browser key:
 * `{browser: [{Obj}, {Obj}, ...]}``
 * @private
 */
var getBenchmarksByBrowser = function (suite) {
  return suite.reduce(function (acc, browserBenchmark) {
    var browser = browserBenchmark.browser;
    var benchmark = browserBenchmark.benchmark;

    acc[browser] = acc[browser] || [];
    acc[browser].push(benchmark);

    return acc;
  }, {});
};

/**
 * @param  {string} browserName the name of the browser
 * @param  {number} browserWidth the target width of the formatted browser name
 * @param {Object} style object containing wrapper functions (e.g., chalk functions)
 * @return {string} the formatted browser name
 * @private
 */
var getFormattedBrowserName = function (browserName, browserWidth, style) {
  return style.browser(
    _.padEnd("[" + browserName + "]", browserWidth)
  );
};

/**
 * @param  {Object[]} suite array of browserBenchmarks: `{browser: {Obj}, benchmark: {Obj}`
 * @param  {Object} benchConfig benchmarkReporter config obj
 * @return {string} the formatted suite summary by browser
 * @private
 */
var getFormattedSuiteSummaryByBrowser = function (suite, benchConfig) {
  var benchmarksByBrowser = getBenchmarksByBrowser(suite);
  return _.keys(benchmarksByBrowser).reduce(function (rows, browserName) {
    var benchmarks = benchmarksByBrowser[browserName];
    var formattedBrowserName = getFormattedBrowserName(
      browserName,
      benchConfig.browserWidth,
      benchConfig.style
    );
    var formattedSuiteSummary = getFormattedSuiteSummary(benchmarks, benchConfig);
    return rows.concat([
      EOL + formattedBrowserName + EOL
      + _.trim(formattedSuiteSummary) + EOL
    ]);
  }, []).join("");
};

/**
 * @param  {Object[]} suite array of browserBenchmarks: `{browser: {Obj}, benchmark: {Obj}`
 * @param  {Object} benchConfig benchmarkReporter config obj
 * @return {string} the formatted suite summary
 */
var formatSuiteSummary = function (suite, benchConfig) {
  if (suite.length <= 1) { return ""; }

  if (benchConfig.showBrowser) {
    return getFormattedSuiteSummaryByBrowser(suite, benchConfig);
  }

  var benchmarks = suite.map(function (browserBenchmark) {
    return browserBenchmark.benchmark;
  });

  return getFormattedSuiteSummary(benchmarks, benchConfig);
};

module.exports = formatSuiteSummary;

"use strict";

// Helpers
var getWidthWithOffset = function (styledStr, terminalWidth, stripAnsi) {
  return terminalWidth + styledStr.length - stripAnsi(styledStr).length;
};

// Default Formatting

// eslint-disable-next-line max-params
var formatBenchmark = function (benchmark, browser, benchConfig, helpers) {
  var chalk = helpers.chalk;
  var _ = helpers._;
  var stripAnsi = helpers.stripAnsi;

  var hzWidth = benchConfig.hzWidth;
  var showBrowser = benchConfig.showBrowser;
  var browserWidth = benchConfig.browserWidth;
  var terminalWidth = benchConfig.terminalWidth;

  var bullet = chalk.cyan("- ");
  var hz = chalk.green(_.pad(Math.round(benchmark.hz), hzWidth));
  var units = chalk.italic.dim(" ops/sec");
  var browserName = showBrowser
    ? chalk.blue(_.padStart(" [" + browser.name + "] ", browserWidth))
    : "";
  var nameWidth = terminalWidth - stripAnsi(
    bullet + hz + units + browserName
  ).length;
  var name = _.padEnd(benchmark.name, nameWidth);

  return bullet + name + hz + units + browserName + "\n";
};

// eslint-disable-next-line max-params
var formatSuiteHeading = function (suiteName, browser, benchConfig, helpers) {
  var _ = helpers._;
  var chalk = helpers.chalk;
  var stripAnsi = helpers.stripAnsi;
  var terminalWidth = benchConfig.terminalWidth;
  var styledStr = chalk.bold.magenta(suiteName);
  var widthWithOffset = getWidthWithOffset(styledStr, terminalWidth, stripAnsi);

  return "\n" + _.pad(styledStr, widthWithOffset) + "\n";
};

var formatSuiteSummaryBenchmarks = function (benchmarks, benchConfig, helpers) {
  var _ = helpers._;
  var chalk = helpers.chalk;
  var stripAnsi = helpers.stripAnsi;
  var terminalWidth = benchConfig.terminalWidth;

  var fastestTwo = _.orderBy(benchmarks, "hz", "desc");
  var fastest = fastestTwo[0];
  var runnerUp = fastestTwo[1];
  var TIMES_AS_FAST_PRECISION = 2;

  var fastestName = chalk.underline(fastest.name);
  var runnerUpName = chalk.underline(runnerUp.name);
  var timesAsFast = chalk.bold.underline(
    _.round(fastest.hz / runnerUp.hz, TIMES_AS_FAST_PRECISION)
  );

  var styledStr = fastestName + " was " + timesAsFast + " times as fast as " + runnerUpName;
  var widthWithOffset = getWidthWithOffset(styledStr, terminalWidth, stripAnsi);

  return "\n" + _.pad(styledStr, widthWithOffset) + "\n";
};

var formatSuiteSummaryByBrowser = function (suite, benchConfig, helpers) {
  var _ = helpers._;
  var chalk = helpers.chalk;
  var stripAnsi = helpers.stripAnsi;
  var terminalWidth = benchConfig.terminalWidth;
  var browserBenchmarks = suite.reduce(function (acc, result) {
    var browser = result.browser;
    var benchmark = result.benchmark;

    acc[browser] = acc[browser] || [];
    acc[browser].push(benchmark);
    return acc;
  }, {});

  var strings = [];
  for (var browser in browserBenchmarks) {
    if (browserBenchmarks.hasOwnProperty(browser)) {
      var benchmarks = browserBenchmarks[browser];
      var formattedStr = formatSuiteSummaryBenchmarks(benchmarks, benchConfig, helpers);
      var formattedBrowser = chalk.dim("[" + browser + "]");
      var formattedBrowserOffset = getWidthWithOffset(formattedBrowser, terminalWidth, stripAnsi);

      strings.push(_.pad(formattedBrowser, formattedBrowserOffset) + " " + formattedStr);
    }
  }

  return strings.join("\n");
};

// eslint-disable-next-line max-statements
var formatSuiteSummary = function (suite, benchConfig, helpers) {
  if (suite.length <= 1) { return ""; }

  if (benchConfig.showBrowser) {
    return formatSuiteSummaryByBrowser(suite, benchConfig, helpers);
  }

  var benchmarks = suite.map(function (result) { return result.benchmark; });

  return formatSuiteSummaryBenchmarks(benchmarks, benchConfig, helpers);
};

module.exports = {
  formatBenchmark: formatBenchmark,
  formatSuiteHeading: formatSuiteHeading,
  formatSuiteSummary: formatSuiteSummary
};

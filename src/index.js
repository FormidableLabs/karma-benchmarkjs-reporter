"use strict";

var _ = require("lodash");
var chalk = require("chalk");
var formatBenchmark = require("./formatting/format-benchmark");
var formatSuiteHeading = require("./formatting/format-suite-heading");
var formatSuiteSummary = require("./formatting/format-suite-summary");
var style = require("./formatting/style");

var BenchmarkReporter = function BenchmarkReporter(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  var benchConfig = _.defaultsDeep(config.benchmarkReporter, {
    colors: config.colors,
    style: style,
    decorator: "-",
    terminalWidth: 60,
    hzWidth: 4,
    hzUnits: "ops/sec",
    browserWidth: 40,
    showBrowser: false,
    showSuiteSummary: false,
    formatBenchmark: formatBenchmark,
    formatSuiteHeading: formatSuiteHeading,
    formatSuiteSummary: formatSuiteSummary
  });

  var formatWithColorConfig = function (string) {
    return !benchConfig.colors
      ? chalk.stripColor(string)
      : string;
  };

  var suites = {};
  var currentSuiteName = "";
  this.specSuccess = function (browser, result) {
    var benchmark = result.benchmark;
    var suiteName = benchmark.suite;

    suites[suiteName] = suites[suiteName] || [];
    suites[suiteName].push({
      benchmark: benchmark,
      browser: browser
    });

    if (suiteName !== currentSuiteName) {
      if (benchConfig.showSuiteSummary && suites[currentSuiteName]) {
        this.write(formatWithColorConfig(
          benchConfig.formatSuiteSummary(suites[currentSuiteName], benchConfig)
        ));
      }

      currentSuiteName = suiteName;

      this.write(formatWithColorConfig(
        benchConfig.formatSuiteHeading(suiteName, browser, benchConfig)
      ));
    }

    this.write(formatWithColorConfig(
      benchConfig.formatBenchmark(benchmark, browser, benchConfig)
    ));
  };

  this.onRunComplete = function () {
    // run last suite summary
    if (benchConfig.showSuiteSummary && suites[currentSuiteName]) {
      this.write(formatWithColorConfig(
        benchConfig.formatSuiteSummary(suites[currentSuiteName], benchConfig)
      ));
    }
  };
};

BenchmarkReporter.$inject = ["baseReporterDecorator", "config"];

module.exports = {
  "reporter:benchmark": ["type", BenchmarkReporter]
};

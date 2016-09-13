"use strict";
var defaultFormatting = require("./default-formatting");

var _ = require("lodash");
var chalk = require("chalk");
var stripAnsi = require("strip-ansi");
var helperLibs = {
  _: _,
  chalk: chalk,
  stripAnsi: stripAnsi
};

var BenchmarkReporter = function BenchmarkReporter(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  var benchConfig = _.defaults(config.benchmarkReporter, {
    colors: config.colors,
    terminalWidth: 60,
    hzWidth: 4,
    browserWidth: 40,
    showBrowser: false,
    showSuiteSummary: false,
    formatBenchmark: defaultFormatting.formatBenchmark,
    formatSuiteHeading: defaultFormatting.formatSuiteHeading,
    formatSuiteSummary: defaultFormatting.formatSuiteSummary
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
          benchConfig.formatSuiteSummary(suites[currentSuiteName], benchConfig, helperLibs)
        ));
      }

      currentSuiteName = suiteName;

      this.write(formatWithColorConfig(
        benchConfig.formatSuiteHeading(suiteName, browser, benchConfig, helperLibs)
      ));
    }

    this.write(formatWithColorConfig(
      benchConfig.formatBenchmark(benchmark, browser, benchConfig, helperLibs)
    ));
  };

  this.onRunComplete = function () {
    // run last suite summary
    if (benchConfig.showSuiteSummary && suites[currentSuiteName]) {
      this.write(formatWithColorConfig(
        benchConfig.formatSuiteSummary(suites[currentSuiteName], benchConfig, helperLibs)
      ));
    }
  };
};

BenchmarkReporter.$inject = ["baseReporterDecorator", "config"];

module.exports = {
  "reporter:benchmark": ["type", BenchmarkReporter]
};

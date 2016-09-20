"use strict";

var _ = require("lodash");
var formatBenchmark = require("./formatting/format-benchmark");
var formatSuiteHeading = require("./formatting/format-suite-heading");
var formatSuiteSummary = require("./formatting/format-suite-summary");
var style = require("./formatting/style");

var BenchmarkReporter = function BenchmarkReporter(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  this.benchConfig = _.defaultsDeep(config.benchmarkReporter, {
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
      if (this.benchConfig.showSuiteSummary && suites[currentSuiteName]) {
        this.write(
          this.benchConfig.formatSuiteSummary(suites[currentSuiteName], this.benchConfig)
        );
      }

      currentSuiteName = suiteName;

      this.write(
        this.benchConfig.formatSuiteHeading(suiteName, browser, this.benchConfig)
      );
    }

    this.write(
      this.benchConfig.formatBenchmark(benchmark, browser, this.benchConfig)
    );
  };

  this.onRunComplete = function () {
    // run last suite summary
    if (this.benchConfig.showSuiteSummary && suites[currentSuiteName]) {
      this.write(
        this.benchConfig.formatSuiteSummary(suites[currentSuiteName], this.benchConfig)
      );
    }
  };
};

BenchmarkReporter.$inject = ["baseReporterDecorator", "config"];

module.exports = {
  "reporter:benchmark": ["type", BenchmarkReporter]
};

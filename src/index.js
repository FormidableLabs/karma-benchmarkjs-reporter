"use strict";
const _ = require("lodash");
const chalk = require("chalk");
const stripAnsi = require("strip-ansi");

const { formatBenchmark, formatSuiteHeading, formatSuiteSummary } = require("./default-formatting");
const helperLibs = {
  _,
  chalk,
  stripAnsi
};

const BenchmarkReporter = function BenchmarkReporter(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  const benchConfig = _.defaults(config.benchmarkReporter, {
    colors: config.colors,
    terminalWidth: 60,
    hzWidth: 4,
    browserWidth: 40,
    showBrowser: false,
    showSuiteSummary: false,
    formatBenchmark,
    formatSuiteHeading,
    formatSuiteSummary
  });

  const formatWithColorConfig = (string) => {
    return !benchConfig.colors
      ? chalk.stripColor(string)
      : string;
  };

  const suites = {};
  let currentSuiteName = "";
  this.specSuccess = (browser, result) => {
    const benchmark = result.benchmark;
    const suiteName = benchmark.suite;

    suites[suiteName] = suites[suiteName] || [];
    suites[suiteName].push({
      benchmark,
      browser
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

  this.onRunComplete = () => {
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

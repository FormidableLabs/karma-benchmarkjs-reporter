"use strict";
var chalk = require("chalk");
var _ = require("lodash");

var BenchmarkReporter = function BenchmarkReporter(baseReporterDecorator, config) {
  baseReporterDecorator(this);

  var benchConfig = _.defaults(config.benchmarkReporter, {
    colors: config.colors,
    terminalWidth: 100,
    hzWidth: 4,
    browserWidth: 40,
    showBrowser: false,
    formatSuiteHeading: function formatSuiteLine(suite, browser, benchConfig, chalk, _) { // eslint-disable-line no-shadow, max-len, max-params
      return "\n" + chalk.bold.magenta(_.pad(suite, benchConfig.terminalWidth)) + "\n";
    },
    formatBenchmark: function formatBenchmark(benchmark, browser, benchConfig, chalk, _) { // eslint-disable-line no-shadow, max-len, max-params
      var name = benchmark.name;
      var hz = benchmark.hz;
      var browserName = _.padStart(
        benchConfig.showBrowser ? "[" + browser.name + "]" : "",
        benchConfig.browserWidth
      );
      var bullet = "- ";
      var paddedFreq = " " + _.padStart(Math.round(hz), benchConfig.hzWidth) + " ";
      var ops = "ops/sec";
      var paddedName = _.padEnd(
        name,
        benchConfig.terminalWidth - bullet.length - paddedFreq.length
        - ops.length - browserName.length
      );
      return chalk.cyan(bullet) + paddedName + chalk.green(paddedFreq) +
        chalk.italic.dim(ops) + chalk.blue(browserName) + "\n";
    }
  });

  var currentSuite = "";

  var formatWithColorConfig = function formatWithColorConfig(string) {
    return !benchConfig.colors
      ? chalk.stripColor(string)
      : string;
  };

  this.specSuccess = function specSuccess(browser, result) {
    var benchmark = result.benchmark;
    var suite = benchmark.suite;

    if (suite !== currentSuite) {
      currentSuite = suite;
      this.write(formatWithColorConfig(
        benchConfig.formatSuiteHeading(suite, browser, benchConfig, chalk, _)
      ));
    }

    this.write(formatWithColorConfig(
      benchConfig.formatBenchmark(benchmark, browser, benchConfig, chalk, _)
    ));
  };
};

BenchmarkReporter.$inject = ["baseReporterDecorator", "config"];

module.exports = {
  "reporter:benchmark": ["type", BenchmarkReporter]
};

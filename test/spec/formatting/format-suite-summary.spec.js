var expect = require("chai").expect;
var chalk = require("chalk");
var EOL = require("os").EOL;
var formatSuiteSummary = require("../../../src/formatting/format-suite-summary");
var sampleData = require("../sample-data");

describe("formatSuiteSummary()", function () {
  beforeEach(function () {
    var NUM_BENCHMARKS = 6;
    var NUM_BROWSERS = 2;
    this.suite = sampleData.getSuite(NUM_BENCHMARKS, NUM_BROWSERS);
    this.benchConfig = sampleData.getBenchConfig();
  });

  it("should format the suite summary", function () {
    var formattedSuiteSummary = formatSuiteSummary(
      this.suite, this.benchConfig
    );
    expect(formattedSuiteSummary).to.equal(
      EOL + "     \u001b[4mbenchmark 5\u001b[24m was \u001b[1m\u001b[4m1.25" +
      "\u001b[24m\u001b[22m times as fast as \u001b[4mbenchmark 4\u001b[24m      " + EOL
    );
  });

  it("should format the suite summary with browser", function () {
    this.benchConfig.showBrowser = true;
    var formattedSuiteSummary = formatSuiteSummary(
      this.suite, this.benchConfig
    );
    expect(formattedSuiteSummary).to.equal(
      EOL + "\u001b[34m[PhantomJS 2.1.1 (Mac OS X 0.0.0)]      \u001b[39m" + EOL +
      "\u001b[4mbenchmark 4\u001b[24m was \u001b[1m\u001b[4m2\u001b[24m\u001b[22m " +
      "times as fast as \u001b[4mbenchmark 2\u001b[24m" + EOL + EOL +
      "\u001b[34m[Chrome 52.0.2743.116 (Mac OS X 10.11.6)]\u001b[39m" + EOL +
      "\u001b[4mbenchmark 5\u001b[24m was \u001b[1m\u001b[4m1.67\u001b[24m\u001b[22m" +
      " times as fast as \u001b[4mbenchmark 3\u001b[24m" + EOL
    );
  });

  it("should strip colors if colors set to false", function () {
    this.benchConfig.colors = true;
    var summaryWithColor = formatSuiteSummary(this.suite, this.benchConfig);
    this.benchConfig.colors = false;
    var summaryWithoutColor = formatSuiteSummary(this.suite, this.benchConfig);
    expect(summaryWithoutColor).to.equal(chalk.stripColor(summaryWithColor));
  });
});

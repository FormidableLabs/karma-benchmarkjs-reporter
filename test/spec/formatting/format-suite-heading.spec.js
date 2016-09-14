var expect = require("chai").expect;
var chalk = require("chalk");
var EOL = require("os").EOL;
var formatSuiteHeading = require("../../../src/formatting/format-suite-heading");
var sampleData = require("../sample-data");

describe("formatSuiteHeading()", function () {
  beforeEach(function () {
    this.suiteName = sampleData.getSuiteName(1);
    this.browser = sampleData.getBrowsers(1);
    this.benchConfig = sampleData.getBenchConfig();
  });

  it("should format the suite heading", function () {
    var formattedSuiteHeading = formatSuiteHeading(
      this.suiteName, this.browser, this.benchConfig
    );
    expect(formattedSuiteHeading).to.equal(
      EOL + "\u001b[1m\u001b[35m                        test suite 1" +
      "                        \u001b[39m\u001b[22m" + EOL
    );
  });

  it("should adjust padding based on terminalWidth", function () {
    this.benchConfig.terminalWidth = 100;
    var formattedSuiteHeading = formatSuiteHeading(
      this.suiteName, this.browser, this.benchConfig
    );
    expect(formattedSuiteHeading).to.equal(
      EOL + "\u001b[1m\u001b[35m                                            test suite 1" +
      "                                            \u001b[39m\u001b[22m" + EOL
    );
  });

  it("should strip colors if colors set to false", function () {
    this.benchConfig.colors = false;
    var formattedSuiteHeading = formatSuiteHeading(
      this.suiteName, this.browser, this.benchConfig
    );
    expect(formattedSuiteHeading).to.equal(chalk.stripColor(formattedSuiteHeading));
  });
});

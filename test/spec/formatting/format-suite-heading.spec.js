var expect = require("chai").expect;
var stripAnsi = require("strip-ansi");
var EOL = require("os").EOL;
var formatSuiteHeading = require("../../../src/formatting/format-suite-heading");
var sampleData = require("../sample-data");

describe("formatSuiteHeading()", function () {
  var suiteName;
  var browser;
  var benchConfig;

  beforeEach(function () {
    suiteName = sampleData.getSuiteName(1);
    browser = sampleData.getBrowsers(1)[0];
    benchConfig = sampleData.getBenchConfig();
  });

  it("should format the suite heading", function () {
    var formattedSuiteHeading = formatSuiteHeading(suiteName, browser, benchConfig);
    expect(formattedSuiteHeading).to.equal(
      EOL
        + "\u001b[1m\u001b[35m                        test suite 1"
        + "                        \u001b[39m\u001b[22m"
        + EOL
    );
  });

  it("should adjust padding based on terminalWidth", function () {
    benchConfig.terminalWidth = 100;
    var formattedSuiteHeading = formatSuiteHeading(suiteName, browser, benchConfig);
    expect(formattedSuiteHeading).to.equal(
      EOL
        + "\u001b[1m\u001b[35m                                            test suite 1"
        + "                                            \u001b[39m\u001b[22m"
        + EOL
    );
  });

  it("should strip colors if colors set to false", function () {
    benchConfig.colors = false;
    var formattedSuiteHeading = formatSuiteHeading(suiteName, browser, benchConfig);
    expect(formattedSuiteHeading).to.equal(stripAnsi(formattedSuiteHeading));
  });
});

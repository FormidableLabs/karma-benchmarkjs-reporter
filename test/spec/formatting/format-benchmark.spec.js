var expect = require("chai").expect;
var stripAnsi = require("strip-ansi");
var EOL = require("os").EOL;
var formatBenchmark = require("../../../src/formatting/format-benchmark");
var sampleData = require("../sample-data");

describe("formatBenchmark()", function () {
  var benchmark;
  var browser;
  var benchConfig;

  beforeEach(function () {
    benchmark = sampleData.getBenchmark(1);
    browser = sampleData.getBrowsers(1)[0];
    benchConfig = sampleData.getBenchConfig();
  });

  it("should format the benchmark", function () {
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                  "
        + "\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m"
        + EOL
    );
  });

  it("should format the benchmark with browser", function () {
    benchConfig.showBrowser = true;
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec "
        + "\u001b[22m\u001b[23m\u001b[34m[PhantomJS 2.1.1 (Mac OS X 0.0.0)]\u001b[39m"
        + EOL
    );
  });

  it("should format the benchmark with custom browserWidth", function () {
    benchConfig.showBrowser = true;
    benchConfig.terminalWidth = 120;
    benchConfig.browserWidth = 60;
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                                  "
        + "          \u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m"
        + "\u001b[34m[PhantomJS 2.1.1 (Mac OS X 0.0.0)]\u001b[39m"
        + EOL
    );
  });

  it("should format the benchmark with custom decorator", function () {
    benchConfig.decorator = "*";
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m* \u001b[39mbenchmark 1                                  "
        + "\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m"
        + EOL
    );
  });

  it("should format the benchmark with custom terminalWidth", function () {
    benchConfig.terminalWidth = 100;
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                        "
        + "                                  \u001b[32m   1\u001b[39m\u001b[3m\u001b"
        + "[2m ops/sec \u001b[22m\u001b[23m"
        + EOL
    );
  });

  it("should format the benchmark with custom hzWidth", function () {
    benchConfig.hzWidth = 10;
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                            \u001b[32m  "
        + "       1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m"
        + EOL
    );
  });

  it("should format the benchmark with custom hzUnits", function () {
    benchConfig.hzUnits = "ops per second";
    var formattedBenchmark = formatBenchmark(benchmark, browser, benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                           \u001b[32m   "
        + "1\u001b[39m\u001b[3m\u001b[2m ops per second \u001b[22m\u001b[23m"
        + EOL
    );
  });

  it("should strip colors if colors set to false", function () {
    benchConfig.colors = true;
    var benchWithColor = formatBenchmark(benchmark, browser, benchConfig);
    benchConfig.colors = false;
    var benchWithoutColor = formatBenchmark(benchmark, browser, benchConfig);
    expect(benchWithoutColor).to.equal(stripAnsi(benchWithColor));
  });
});

var expect = require("chai").expect;
var chalk = require("chalk");
var EOL = require("os").EOL;
var formatBenchmark = require("../../../src/formatting/format-benchmark");
var sampleData = require("../sample-data");

describe("formatBenchmark()", function () {
  beforeEach(function () {
    this.benchmark = sampleData.getBenchmark(1);
    this.browser = sampleData.getBrowsers(1);
    this.benchConfig = sampleData.getBenchConfig();
  });

  it("should format the benchmark", function () {
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                  " +
      "\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m" + EOL
    );
  });

  it("should format the benchmark with browser", function () {
    this.benchConfig.showBrowser = true;
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec " +
      "\u001b[22m\u001b[23m\u001b[34m[PhantomJS 2.1.1 (Mac OS X 0.0.0)]\u001b[39m" + EOL
    );
  });

  it("should format the benchmark with custom browserWidth", function () {
    this.benchConfig.showBrowser = true;
    this.benchConfig.terminalWidth = 120;
    this.benchConfig.browserWidth = 60;
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                                  " +
      "          \u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m" +
      "\u001b[34m[PhantomJS 2.1.1 (Mac OS X 0.0.0)]\u001b[39m" + EOL
    );
  });

  it("should format the benchmark with custom decorator", function () {
    this.benchConfig.decorator = "*";
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
     "\u001b[36m* \u001b[39mbenchmark 1                                  " +
     "\u001b[32m   1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m" + EOL
    );
  });

  it("should format the benchmark with custom terminalWidth", function () {
    this.benchConfig.terminalWidth = 100;
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                                        " +
      "                                  \u001b[32m   1\u001b[39m\u001b[3m\u001b" +
      "[2m ops/sec \u001b[22m\u001b[23m" + EOL
    );
  });

  it("should format the benchmark with custom hzWidth", function () {
    this.benchConfig.hzWidth = 10;
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                            \u001b[32m  " +
      "       1\u001b[39m\u001b[3m\u001b[2m ops/sec \u001b[22m\u001b[23m" + EOL
    );
  });

  it("should format the benchmark with custom hzUnits", function () {
    this.benchConfig.hzUnits = "ops per second";
    var formattedBenchmark = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(formattedBenchmark).to.equal(
      "\u001b[36m- \u001b[39mbenchmark 1                           \u001b[32m   " +
      "1\u001b[39m\u001b[3m\u001b[2m ops per second \u001b[22m\u001b[23m" + EOL
    );
  });

  it("should strip colors if colors set to false", function () {
    this.benchConfig.colors = true;
    var benchWithColor = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    this.benchConfig.colors = false;
    var benchWithoutColor = formatBenchmark(this.benchmark, this.browser, this.benchConfig);
    expect(benchWithoutColor).to.equal(chalk.stripColor(benchWithColor));
  });
});



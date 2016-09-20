var _ = require("lodash");
var style = require("../../src/formatting/style");

var getBenchConfig = function () {
  return {
    colors: true,
    style: style,
    decorator: "-",
    terminalWidth: 60,
    hzWidth: 4,
    hzUnits: "ops/sec",
    browserWidth: 40,
    showBrowser: false,
    showSuiteSummary: false
  };
};

var getSuiteName = function (index) {
  index = index || 1;
  var baseName = "test suite";
  return baseName + " " + index;
};

var getBrowsers = function (qty) {
  var browsers = [
    { name: "PhantomJS 2.1.1 (Mac OS X 0.0.0)" },
    { name: "Chrome 52.0.2743.116 (Mac OS X 10.11.6)" },
    { name: "Safari 9.1.3 (Mac OS X 10.11.6)" },
    { name: "Firefox 48.0.2 (Mac OS X 10.11.6)" }
  ];

  qty = qty || 1;
  qty = Math.min(qty, browsers.length);

  return browsers.slice(0, qty);
};

var getBenchmark = function (index, suiteIndex) {
  suiteIndex = suiteIndex || 1;
  index = index || 1;
  return {
    suite: getSuiteName(suiteIndex),
    name: "benchmark " + index,
    hz: index
  };
};

var getSuite = function (numBenchmarks, numBrowsers) {
  var browsers = getBrowsers(numBrowsers);

  return _.times(numBenchmarks, function (index) {
    return {
      browser: browsers[index % browsers.length],
      benchmark: getBenchmark(index)
    };
  });
};

module.exports = {
  getBrowsers: getBrowsers,
  getBenchConfig: getBenchConfig,
  getBenchmark: getBenchmark,
  getSuite: getSuite,
  getSuiteName: getSuiteName
};

"use strict";

// Helpers
const getWidthWithOffset = (styledStr, terminalWidth, stripAnsi) => {
  return terminalWidth + styledStr.length - stripAnsi(styledStr).length;
};

// Default Formatting

// eslint-disable-next-line max-params
const formatBenchmark = (benchmark, browser, benchConfig, helpers) => {
  const { chalk, _, stripAnsi } = helpers;
  const { hzWidth, showBrowser, browserWidth, terminalWidth } = benchConfig;

  const bullet = chalk.cyan("- ");
  const hz = chalk.green(_.pad(Math.round(benchmark.hz), hzWidth));
  const units = chalk.italic.dim(" ops/sec");
  const browserName = showBrowser
    ? chalk.blue(_.padStart(` [${browser.name}] `, browserWidth))
    : "";
  const nameWidth = terminalWidth - stripAnsi(`${bullet}${hz}${units}${browserName}`).length;
  const name = _.padEnd(benchmark.name, nameWidth);

  return `${bullet}${name}${hz}${units}${browserName}\n`;
};

// eslint-disable-next-line max-params
const formatSuiteHeading = (suiteName, browser, benchConfig, helpers) => {
  const { _, chalk, stripAnsi } = helpers;
  const { terminalWidth } = benchConfig;
  const styledStr = chalk.bold.magenta(suiteName);
  const widthWithOffset = getWidthWithOffset(styledStr, terminalWidth, stripAnsi);

  return `\n${_.pad(styledStr, widthWithOffset)}\n`;
};

const formatSuiteSummaryBenchmarks = (benchmarks, benchConfig, helpers) => {
  const { _, chalk, stripAnsi } = helpers;
  const { terminalWidth } = benchConfig;
  const TIMES_AS_FAST_PRECISION = 2;

  const [fastest, runnerUp] = _.orderBy(benchmarks, "hz", "desc");
  const fastestName = chalk.underline(fastest.name);
  const runnerUpName = chalk.underline(runnerUp.name);
  const timesAsFast = chalk.bold.underline(
    _.round(fastest.hz / runnerUp.hz, TIMES_AS_FAST_PRECISION)
  );

  const styledStr = `${fastestName} was ${timesAsFast} times as fast as ${runnerUpName}`;
  const widthWithOffset = getWidthWithOffset(styledStr, terminalWidth, stripAnsi);

  return `\n ${_.pad(styledStr, widthWithOffset)} \n`;
};

const formatSuiteSummaryByBrowser = (suite, benchConfig, helpers) => {
  const { _, chalk, stripAnsi } = helpers;
  const { terminalWidth } = benchConfig;
  const browserBenchmarks = suite.reduce((acc, { browser, benchmark }) => {
    acc[browser] = acc[browser] || [];
    acc[browser].push(benchmark);
    return acc;
  }, {});

  const strings = [];
  for (const browser in browserBenchmarks) {
    if (browserBenchmarks.hasOwnProperty(browser)) {
      const benchmarks = browserBenchmarks[browser];
      const formattedStr = formatSuiteSummaryBenchmarks(benchmarks, benchConfig, helpers);
      const formattedBrowser = chalk.dim(`[${browser}]`);
      const formattedBrowserOffset = getWidthWithOffset(formattedBrowser, terminalWidth, stripAnsi);

      strings.push(`${_.pad(formattedBrowser, formattedBrowserOffset)} ${formattedStr}`);
    }
  }

  return strings.join("\n");
};

// eslint-disable-next-line max-statements
const formatSuiteSummary = (suite, benchConfig, helpers) => {
  if (suite.length <= 1) { return ""; }

  const { showBrowser } = benchConfig;

  if (showBrowser) {
    return formatSuiteSummaryByBrowser(suite, benchConfig, helpers);
  }

  const benchmarks = suite.map(({ benchmark }) => benchmark);

  return formatSuiteSummaryBenchmarks(benchmarks, benchConfig, helpers);
};

module.exports = {
  formatBenchmark,
  formatSuiteHeading,
  formatSuiteSummary
};

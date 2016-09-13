# Karma Benchmark.js Reporter
> A configurable [Karma](https://karma-runner.github.io) reporter for the [karma-benchmark](https://github.com/JamieMason/karma-benchmark) plugin.

## Installation
```sh
npm install karma-benchmark karma-benchmarkjs-reporter --save-dev
```

## Karma Configuration
Add `benchmark` to your `frameworks` and `reporters` arrays. Optionally, specify
```js
module.exports = function(config) {
  config.set({
    // ...
    frameworks: ["benchmark"],
    reporters: ["benchmark"],
    // optional configuration object :
    benchmarkReporter: {
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
    }
  });
};
```

### Options
#### `colors`
*default:* `true`

This value is inherited from Karma, but you can override it by specifying a boolean.

#### `style`
*default:*
```js
{
  benchmark: chalk.stripColor,
  summaryBenchmark: chalk.underline,
  summaryEmphasis: chalk.bold.underline,
  browser: chalk.blue,
  decorator: chalk.cyan,
  hz: chalk.green,
  hzUnits: chalk.italic.dim,
  suite: chalk.bold.magenta
}
```

The style object contains the styling functions for piece of data. The default uses [`chalk`](https://github.com/chalk/chalk) for styling and color.

#### `decorator`
*default:* `"-"`

The decorator for the beginning of each benchmark row.

#### `terminalWidth`
*default:* `60`

The default formatting functions attempt to match this column width for each row. There is still possibility for overflow.

#### `hzWidth`
*default:* `4`

The default formatting functions use this to pad the formatted `hz` string.

#### `hzUnits`
*default:* `"ops/sec"`

The string placed after the `hz` as units.

#### `browserWidth`
*default:* `40`

The default formatting functions use this to pad the browser name.

#### `showBrowser`
*default:* `false`

The default formatting functions only output the browser name if set to `true`. It is useful if you are benchmarking multiple browsers.

#### `showSuiteSummary`
*default:* `false`

Specify if you want to call the `formatSuiteSummary` function at the end of a suite.

#### Formatting functions

If you override the default formatting functions, you must ensure that your functions take into account the other configuration values (if you want to use them).

[View the default formatting functions](https://github.com/FormidableLabs/karma-benchmarkjs-reporter/blob/master/src/formatting/)

```js
/**
 * @param  {Object} benchmark the benchmark to be formatted
 * @param  {Object} browser the browser associated with the benchmark
 * @param  {Object} benchConfig the benchmarkReporter config obj
 * @return {string} the formatted benchmark
 */
var formatBenchmark = function (benchmark, browser, benchConfig) {...};

/**
 * @param  {string} suiteName name of performance suite
 * @param  {Object} browser browser object
 * @param  {Object} benchConfig benchmarkReporter config object
 * @return {string} formatted suite heading
 */
var formatSuiteHeading = function (suiteName, browser, benchConfig) {...};

/**
 * @param  {Object[]} suite array of browserBenchmarks: `{browser: {Obj}, benchmark: {Obj}`
 * @param  {Object} benchConfig benchmarkReporter config obj
 * @return {string} the formatted suite summary
 */
var formatSuiteSummary = function (suite, benchConfig) {
```

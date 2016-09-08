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
      terminalWidth: 80,
      hzWidth: 5,
      showBrowser: true,
      browserWidth: 45,
      formatSuiteHeading: function(suite, browser, benchConfig, chalk, _) { ... },
      formatBenchmark: function(benchmark, browser, benchConfig, chalk, _) { ... }
    }
  });
};
```

### Options

#### `terminalWidth`
*default:* `100`

The default formatting functions attempt to match this column width for each row. There is still possibility for overflow.

#### `hzWidth`
*default:* `4`

The default formatting functions use this to pad the ops/sec integer.

#### `browserWidth`
*default:* `40`

The default formatting functions use this to pad the browser name.

#### `showBrowser`
*default:* `false`

The default formatting functions only output the browser name if set to `true`. It is useful if you are benchmarking multiple browsers.

#### Formatting functions

If you override the default formatting functions, you must ensure that your functions take into
account the other configuration values (if you want to use them).

##### Argument Descriptions
- `suite` : `string`
- `browser` - [see karma](https://github.com/karma-runner/karma/blob/e36ba6c1d4cad4fc321f3376129b329fe663068d/lib/browser.js#L62)
  ```js
  {
    id,
    fullName,
    name,
    state,
    lastResult,
    disconnectsCount
  }
  ```
- `benchmark` - [see karma-benchmark](https://github.com/JamieMason/karma-benchmark/blob/283b76866ff65f2817fb3a0db0cc84704f7738f5/src/adapter.js#L27)
  ```js
  {
    name: string,
    hz: number,
    suite: string
  }
  ```
- `benchConfig`
  ```js
  {
    colors: boolean,
    terminalWidth: int,
    hzWidth: int,
    browswerWidth: int,
    showBrowser: boolean,
    formatSuiteHeading: fn,
    formatBenchmark: fn
  }
  ```
- `chalk` - [Chalk api](https://github.com/chalk/chalk) "Terminal string styling done right."
- `_` - [Lodash api](https://lodash.com/docs/) "A modern JavaScript utility library delivering modularity, performance & extras."


##### `formatSuiteHeading`
*default:*
```js
function formatSuiteLine(suite, browser, benchConfig, chalk, _) {
  return "\n" + chalk.bold.magenta(_.pad(suite, benchConfig.terminalWidth)) + "\n";
}
```

##### `formatBenchmark`
*default:*
```js
function formatBenchmark(result, browser, benchConfig, chalk, _) {
  var name = result.benchmark.name;
  var hz = result.benchmark.hz;
  var browserName = _.padStart(
    benchConfig.showBrowser ? "[" + browser.name + "]" : "",
    benchConfig.browserWidth
  );
  var bullet = "- ";
  var paddedFreq = " " + _.padStart(Math.round(hz), benchConfig.hzWidth) + " ";
  var ops = "ops/sec";
  var paddedName = _.padEnd(
      name,
      benchConfig.terminalWidth - bullet.length - paddedFreq.length - ops.length - browserName.length
    );
    return chalk.cyan(bullet) + paddedName + chalk.green(paddedFreq) +
      chalk.italic.dim(ops) + chalk.blue(browserName) + "\n";
}
```

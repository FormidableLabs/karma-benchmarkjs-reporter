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
      colors: true,
      terminalWidth: 100,
      hzWidth: 4,
      browserWidth: 40,
      showBrowser: false,
      showSuiteSummary: false,
      formatBenchmark: function (benchmark, browser, benchConfig, helpers) { ... },
      formatSuiteHeading: function (suite, browser, benchConfig, helpers) { ... },
      formatSuiteSummary: function (benchmarks, browser, benchConfig, helpers) { ... }
    }
  });
};
```

### Options
#### `colors`
*default:* `true`

This value is inherited from Karma, but you can override it by specifying a boolean.

#### `terminalWidth`
*default:* `60`

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

#### `showSuiteSummary`
*default:* `false`

Specify if you want to call the `formatSuiteSummary` function at the end of a suite.

#### Formatting functions

If you override the default formatting functions, you must ensure that your functions take into account the other configuration values (if you want to use them).

[View the default formatting functions](https://github.com/FormidableLabs/karma-benchmarkjs-reporter/blob/master/src/default-formatting.js)

##### Argument Descriptions
- `suiteName` : The name of the suite.

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

- `benchmarks` - An array of the suite's benchmarks:

  ```js
  [
    {
      name: string,
      hz: number,
      suite: string
    },
    // ...
    {
      name: string,
      hz: number,
      suite: string
    }
  ]
  ```

- `benchConfig`

  ```js
  {
    colors: boolean,
    terminalWidth: int,
    hzWidth: int,
    browserWidth: int,
    showBrowser: boolean,
    formatBenchmark: fn,
    formatSuiteHeading: fn,
    formatSuiteSummary: fn
  }
  ```

- `helpers` - Helper libs are passed to these functions including:

  - `_` - [Lodash api](https://lodash.com/docs/) "A modern JavaScript utility library delivering modularity, performance & extras."
  - `chalk` - [Chalk api](https://github.com/chalk/chalk) "Terminal string styling done right."
  - `stripAnsi` - [strip-ansi](https://github.com/chalk/strip-ansi) "Strip ANSI escape codes."

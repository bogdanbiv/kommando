var async = require('async');
var path = require('path');

var lodash = require('lodash');
var run = require('../../src/index.js');

var capabilities = [{browserName: 'phantomjs'}];
var driver = 'phantomjs';

var configSeleniumWebdriverJasmine = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-google-search.js')
  ]
};

var configSeleniumWebdriverJasmineWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-google-search.js')
  ],
  runnerModules: [
    'jasmine-selenium-webdriver'
  ]
};

var configPlainJasmine = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'plain-github.js')
  ],
  runner: 'plain'
};

var configSeleniumWebdriverMochaWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-google-search.js')
  ],
  runnerModules: [
    'mocha-selenium-webdriver'
  ],
  runnerOptions: {
    reporter: 'dot'
  },
  runner: 'mocha'
};

var configWdMocha = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd', 'mocha-github.js'),
    path.join(__dirname, 'wd', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'spec'
  },
  client: 'wd'
};

var configWdPromiseMocha = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd-promise', 'mocha-github.js'),
    path.join(__dirname, 'wd-promise', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'nyan'
  },
  client: 'wd-promise'
};

var configCabbieMocha = {
  // executing with selenium because cabbie in combination with Ghostdriver
  // currently fails with the initial session-request
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'cabbie', 'mocha-github.js'),
    path.join(__dirname, 'cabbie', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'spec'
  },
  client: 'cabbie'
};

async.series([
  run.bind(null, configSeleniumWebdriverJasmine),
  run.bind(null, configSeleniumWebdriverJasmineWithHelper),
  run.bind(null, configPlainJasmine),
  run.bind(null, configSeleniumWebdriverMochaWithHelper),
  run.bind(null, configWdMocha),
  run.bind(null, configWdPromiseMocha),
  run.bind(null, configCabbieMocha)
], function(error, results) {
  var passed = lodash.every(lodash.map(results, function(result) {
    return lodash.every(result, 'passed');
  }));
  if (!passed) {
    error = new Error('One or more tests did not pass.');
  }

  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    process.exit(0);
  }
});

var jasmine = require('jasmine-node');

module.exports = {
  setup: function(config) {
    config.runnerModules.forEach(function(runnerModule) {
      require(runnerModule);
    });
    jasmine.getEnv().defaultTimeoutInterval = 10000;
    global.kommando = config.kommando;

    describe(config.kommando.capabilities.browserName, function() {
      config.tests.forEach(function(test) {
        require(test);
      });
    });
  },
  run: function(callback) {
    var onComplete = function(runner, log) {
      var passed = false;
      if (runner.results().failedCount === 0) {
        passed = true;
      }
      callback(null, passed);
    };

    var options = {
      match: '.',
      matchall: false,
      specNameMatcher: 'spec',
      extensions: 'js',
      regExpSpec: /.spec\.(js)$/i,
      specFolders: [],
      onComplete: onComplete,
      isVerbose: false,
      showColors: true,
      teamcity: false,
      coffee: false,
      useRequireJs: false,
      junitreport: {
        report: true,
        savePath : "./reports/",
        useDotNotation: true,
        consolidate: true
      }
    };
    jasmine.executeSpecsInFolder(options);
  }
};

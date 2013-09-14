var Mocha = require('mocha');

var mochaInstance;

module.exports = {
  setup: function(config) {
    var options = {
      globals: ['should', 'kommando'],
      timeout: 10000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    };
    global.kommando = config.kommando;
    mochaInstance = new Mocha(options);
    mochaInstance.suite.title = config.kommando.capabilities.browserName;

    mochaInstance.suite.on('pre-require', function(context, file, mocha) {
      config.runnerModules.forEach(function(runnerModule) {
        require(runnerModule);
      });
    });

    config.tests.forEach(function(test) {
      mochaInstance.addFile(test);
    });
  },
  run: function(callback) {
    mochaInstance.run(function(errCount) {
      callback(null, errCount === 0);
    });
  }
};

var spawn = require('child_process').spawn;

var freeport = require('freeport');

module.exports = function(config) {

  return {
    _appiumProcess: null,
    _seleniumUrl: '',
    create: function(callback) {
      console.log('Starting appium server ...');

      freeport(function(err, port) {
        var child, seleniumUrl;

        if (err) {
          callback(err);
        } else {
          this._seleniumUrl = seleniumUrl = [
            'http://localhost:',
            port,
            '/wd/hub'
          ].join('');
          this._appiumProcess = child = spawn(config.appiumPath || 'appium', [
            '--port', port
          ]);
          child.stdout.on('data', function(data) {
            if (data.toString().indexOf('Welcome to Appium') !== -1) {
              console.log('Appium server started at: ' + seleniumUrl);
              callback(null, seleniumUrl, {});
            }
          });
          child.once('exit', function() {
            callback(new Error('Failed starting Appium.'));
          });
          child.on('error', function(err) {
            callback(err);
          });
        }

      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down appium server at: ' + this._seleniumUrl);
      this._appiumProcess.kill('SIGTERM');
      callback(null);
    }
  };

};

'use strict';

var path = require('path');

module.exports = {
  bootstrap: function($allonsy, $options, $done) {
    if ((!process.env.GULP || process.env.GULP == 'true') && $options.owner == 'gulp') {
      $allonsy.on('message', function(args) {
        if (args.event == 'call(gulp/restart.task)') {
          DependencyInjection.injector.service.get('$gulp').start(args.task);
        }
      });
    }

    $done();
  },
  liveCommands: [!process.env.GULP || process.env.GULP == 'true' ? {
    commands: 'gulp [task]',
    description: 'execute a defined gulp task',
    action: require(path.resolve(__dirname, 'gulp-live-commands.js'))
  } : null]
};


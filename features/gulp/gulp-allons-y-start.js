'use strict';

module.exports = {
  name: 'Allons-y Gulp',
  enabled: !process.env.GULP || process.env.GULP == 'true' || false,
  spawn: true,
  spawnCommands: ['"' + process.execPath + '"', './node_modules/gulp/bin/gulp'],
  spawnMaxRestarts: process.env.GULP_WATCHER && process.env.GULP_WATCHER == 'true' ? 10 : 1
};

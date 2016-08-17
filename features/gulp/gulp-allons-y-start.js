'use strict';

module.exports = {
  name: 'Allons-y Gulp',
  enabled: !process.env.GULP || process.env.GULP == 'true' || false,
  spawn: true,
  spawnCommands: ['node', 'node_modules/gulp/bin/gulp'],
  spawnMaxRestarts: process.env.WATCHER && process.env.WATCHER == 'true' ? 10 : 1
};

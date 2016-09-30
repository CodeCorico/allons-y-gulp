'use strict';

module.exports = function($allonsy, $args) {
  $allonsy.outputInfo('► gulp:\n');

  if (!$args || !$args.length) {
    return $allonsy.outputWarning('  Please specify a task to restart.');
  }

  $allonsy.sendMessage({
    event: 'call(gulp/restart.task)',
    task: $args[0]
  });
};

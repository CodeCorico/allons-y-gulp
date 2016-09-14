'use strict';

module.exports = function(allonsy, gulp) {
  var tasksFinished = 0;

  if (
    (!process.env.GULP_OUTPUT || process.env.GULP_OUTPUT == 'false') &&
    (!process.env.ALLONSY_LIVE_COMMANDS || process.env.ALLONSY_LIVE_COMMANDS == 'true')
  ) {
    process.stdout.write = function(output) {
      allonsy.sendMessage({
        event: 'update(gulp/output)',
        output: output
      });

      var taskIsStarting = output.indexOf('Starting \'') > -1,
          taskIsFinished = output.indexOf('Finished \'') > -1;

      if (taskIsStarting || taskIsFinished) {
        if (taskIsFinished) {
          tasksFinished++;
        }

        if (output.indexOf('Finished \'default\'') > -1) {
          allonsy.outputInfo('[done:gulp]► Gulp is ready [' + tasksFinished + ' tasks]');
        }
        else {
          allonsy.outputInfo('[working:gulp]► Starting Gulp... [' + tasksFinished + '/' + gulp.defaultTasksCount + ' tasks]');
        }
      }
    };

  }
};

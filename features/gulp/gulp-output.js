'use strict';

module.exports = function(allonsy, gulp) {
  var tasksFinished = 0,
      defaultFinished = false;

  if (
    (!process.env.GULP_OUTPUT || process.env.GULP_OUTPUT == 'false') &&
    (!process.env.ALLONSY_LIVE_COMMANDS || process.env.ALLONSY_LIVE_COMMANDS == 'true')
  ) {
    process.stdout.write = function(output) {
      var taskIsStarting = output.indexOf('Starting \'') > -1,
          taskIsFinished = output.indexOf('Finished \'') > -1;

      if (taskIsStarting || taskIsFinished) {
        if (!defaultFinished) {
          if (taskIsFinished) {
            tasksFinished++;
          }

          if (output.indexOf('Finished \'default\'') > -1) {
            defaultFinished = true;
            allonsy.outputInfo('[done:gulp]► Gulp is ready [' + tasksFinished + ' tasks]');
          }
          else {
            allonsy.outputInfo('[working:gulp]► Starting Gulp... [' + tasksFinished + '/' + gulp.defaultTasksCount + ' tasks]');
          }
        }
        else {
          if (taskIsStarting) {
            output = output.match(/Starting '(.*?)'/);

            allonsy.outputInfo('[working:gulp-' + output[1] + ']► Calling Gulp task "' + output[1] + '"...');
          }
          else {
            output = output.match(/Finished '(.*?)'/);

            allonsy.outputInfo('[done:gulp-' + output[1] + ']► Gulp task "' + output[1] + '" called');
          }
        }
      }
    };

  }
};

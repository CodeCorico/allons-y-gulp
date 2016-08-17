'use strict';

var gulp = require('gulp'),
    path = require('path'),
    extend = require('extend'),
    allonsy = require(path.resolve(__dirname, '../../../allons-y/features/allons-y/allons-y.js'));

process.env.START_GULP = 'true';

allonsy.bootstrap({
  owner: 'gulp'
}, function() {

  var gulpFiles = allonsy.findInFeaturesSync('*-gulpfile.js'),
  defaultTasks = [],
  watch = [],
  afters = [];

  gulpFiles.forEach(function(gulpFile) {
    var gulpModule = require(path.resolve(gulpFile)),
        tasks = DependencyInjection.injector.controller.invoke(null, gulpModule, {
          controller: {
            $allonsy: function() {
              return allonsy;
            },

            $gulp: function() {
              return gulp;
            },

            $default: function() {
              return extend(true, [], defaultTasks);
            }
          }
        });

    if (!tasks) {
      return;
    }

    if (typeof tasks == 'string') {
      tasks = [tasks];
    }
    else if (typeof tasks == 'object') {
      if (Object.prototype.toString.call(tasks) == '[object Object]') {
        if (tasks.after) {
          afters.push(tasks.after);
        }

        if (tasks.watch && tasks.task) {
          var watch = tasks.watch,
              task = tasks.task;

          watch.push(function() {
            gulp.watch(watch, [task]);
          });
        }

        if (tasks.task) {
          tasks = [tasks.task];
        }
        else {
          tasks = null;
        }
      }
    }

    if (tasks && tasks.length) {
      defaultTasks = defaultTasks.concat(tasks);
    }
  });

  if (process.env.START_GULP == 'true') {
    if (process.env.WATCHER && process.env.watcher == 'true' && watch.length) {
      gulp.task('watch', function() {
        watch.forEach(function(watchFunc) {
          watchFunc();
        });
      });

      defaultTasks.push('watch');
    }

    gulp.task('default', defaultTasks);
  }

  if (afters.length) {
    afters.forEach(function(after) {
      DependencyInjection.injector.controller.invoke(null, after, {
        controller: {
          $allonsy: function() {
            return allonsy;
          },

          $gulp: function() {
            return gulp;
          },

          $watch: function() {
            return watch;
          },

          $default: function() {
            return extend(true, [], defaultTasks);
          }
        }
      });
    });
  }
});

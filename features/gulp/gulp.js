'use strict';

var gulp = require('gulp'),
    path = require('path'),
    extend = require('extend'),
    allonsy = require(path.resolve(__dirname, '../../../allons-y/features/allons-y/allons-y.js'));

process.env.GULP_START = 'true';

allonsy.bootstrap({
  owner: 'gulp'
}, function() {

  var gulpFiles = allonsy.findInFeaturesSync('*-gulpfile.js'),
      defaultTasks = [],
      watchs = [],
      afters = [];

  DependencyInjection.service('$gulp', [function() {
    return gulp;
  }]);

  gulpFiles.forEach(function(gulpFile) {
    var gulpModule = require(path.resolve(gulpFile)),
        tasks = DependencyInjection.injector.controller.invoke(null, gulpModule, {
          controller: {
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
          var watch = (typeof tasks.watch == 'string' ? [tasks.watch] : tasks.watch) || [],
              task = tasks.task;

          watchs.push(function() {
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

  if (process.env.GULP_START == 'true') {
    if (process.env.GULP_WATCHER && process.env.GULP_WATCHER == 'true' && watchs.length) {
      gulp.task('watch', function() {
        watchs.forEach(function(watchFunc) {
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
          $watchs: function() {
            return watchs;
          },

          $default: function() {
            return extend(true, [], defaultTasks);
          }
        }
      });
    });
  }
});

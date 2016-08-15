'use strict';

var gulp = require('gulp'),
    path = require('path'),
    extend = require('extend'),
    allonsy = require(path.resolve(__dirname, '../../../allons-y/features/allons-y/allons-y.js'));

allonsy.bootstrap({
  owner: 'gulp'
}, function() {

  var gulpFiles = allonsy.findInFeaturesSync('*-gulpfile.js'),
  defaultTasks = [],
  watchs = [];

  gulpFiles = [];

  gulpFiles.forEach(function(gulpFile) {
    var tasks = require(gulpFile)(gulp, extend(true, [], defaultTasks));

    if (tasks && typeof tasks == 'string') {
      tasks = [tasks];
    }
    else if (tasks && typeof tasks == 'object') {
      if (Object.prototype.toString.call(tasks) == '[object Object]') {
        if (tasks.watch && tasks.task) {
          var watch = tasks.watch,
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
    else {
      return;
    }

    if (tasks && tasks.length) {
      defaultTasks = defaultTasks.concat(tasks);
    }
  });

  if (watchs.length) {
    gulp.task('watch', function() {
      watchs.forEach(function(watchFunc) {
        watchFunc();
      });
    });

    defaultTasks.push('watch');
  }

  gulp.task('default', defaultTasks);
});

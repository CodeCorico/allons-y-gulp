'use strict';

module.exports = function($allonsy, $gulp, $default) {

  var fs = require('fs-extra'),
      excludesPaterns = $gulp.excludeDist();

  $gulp.task('gulp-dist', $default, function(done) {

    excludesPaterns.forEach(function(excludesPatern) {
      $allonsy.glob.sync(excludesPatern).forEach(function(file) {
        fs.removeSync(file);
      });
    });

    done();
  });

  return {
    tasks: 'gulp-dist',
    watch: excludesPaterns
  };
};

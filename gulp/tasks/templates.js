var gulp = require('gulp');
var config = require('../config').templates;
var browserSync  = require('browser-sync');

gulp.task('templates', function() {
  return gulp.src(config.src)
    // .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});

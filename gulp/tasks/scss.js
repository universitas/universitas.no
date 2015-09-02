var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var scss         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', function () {
  /**
   * Generate CSS from SCSS
   * Build sourcemaps
   */
  var scssConfig = config.scss.options;
  // scssConfig.onError = browserSync.notify;
  browserSync.notify('Compiling Scss');

  return gulp.src(config.scss.src)
    .pipe(sourcemaps.init())
    .pipe(scss(scssConfig))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scss.dest))
    .pipe(browserSync.reload({stream:true}));
});

var config      = require('../../config');
var gulp        = require('gulp');
var revReplace  = require('gulp-rev-replace');
var gulpReplace = require('gulp-replace');
var revNapkin   = require('gulp-rev-napkin');
var rev         = require('gulp-rev');
var path        = require('path');

var dest = path.join(config.root.dest, config.tasks.favicon.dest);
gulp.task('update-templates', function(){

  var ignoreThese = '!' + path.join(config.root.dest,'rev-manifest.json');
  var revReplaceOptions = {
    manifest: gulp.src(
      path.join(config.root.dest, "rev-manifest.json")),
    replaceInExtensions: ['.html', '.xml', '.json']
  };

  return gulp.src([
      path.join(config.root.dest, '/**/*.{html,xml,json}'),
      ignoreThese,])
    .pipe(rev())
    .pipe(gulpReplace('\\', ''))
    .pipe(revReplace(revReplaceOptions))
    .pipe(gulp.dest(config.root.dest))
    .pipe(revNapkin({verbose: false}))
    .pipe(rev.manifest(path.join(config.root.dest, 'rev-manifest.json'), {merge: true}))
    .pipe(gulp.dest(''));
});

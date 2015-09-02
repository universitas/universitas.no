/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify.bundleConfigs in gulp/config.js
*/

var gulp         = require('gulp');
var watchify     = require('watchify');
var browserSync  = require('browser-sync');
var browserify   = require('browserify');
var mergeStream  = require('merge-stream');
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var config       = require('../config').browserify;
// var _            = require('lodash');

gulp.task('browserify', function(callback) {
  browserSync.notify('Compiling Javascript');
  var bundleQueue = config.bundleConfigs.length;
  var browserifyThis = function(bundleConfig){
    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: false,
      // Specify the entry piont of you rapp
      entries: bundleConfig.entries,
      // Add file extentions to make optional in your requires
      extensions: config.extensions,
      // Enable source maps!
      debug: config.debug
    });
    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);
      return bundler
        .bundle()
        .on('error', handleErrors)
        // Use vinyl-source-stream to make
        // the stream gulp-compatible. Specify
        // the desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // specify the output destination.
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };
    if(global.isWatching) {
      // Wrap with wathcify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
    }
    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName);
      if(bundleQueue) {
        bundleQueue--;
        if(bundleQueue === 0) {
          // If queue is empty, tell gulp the task
          // is complete
          callback();
        }
      }
    };
    return bundle();
  };
  config.bundleConfigs.forEach(browserifyThis);
});
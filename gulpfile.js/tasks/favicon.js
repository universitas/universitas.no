var config      = require('../config');
if(!config.tasks.favicon) return;

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var changed     = require('gulp-changed');
var favicons    = require('gulp-favicons');
var fs          = require('fs');
var path        = require('path');
var paths       = {
  src: path.join(config.root.src, config.tasks.favicon.src),
  dest: path.join(config.root.dest, config.tasks.favicon.dest)
};

var conf = {
  files: {
    src: paths.src,
    html: path.join('django', 'templates', '_favicons.html'),
    iconsPath: path.join('/static/', config.tasks.favicon.dest) },
    // iconsPath: path.join( 'http://static.universitas.no', config.tasks.favicon.dest) },
  icons: {
    favicons: true,
    appleIcon: true,
    android: true,
    appleStartup: false,
    coast: false,
    firefox: false,
    opengraph: false,
    windows: true,
    yandex: false
  },
  settings: {
    appName: 'universitas.no',
    appDescription: 'student newspaper',
    developer: 'Håken Lid',
    developerURL: 'https://github.com/haakenlid',
    version: 1.0,
    background: '#FFF',
    url: 'http://universitas.no',
    silhouette: true,
    logging: false,
    vinylMode: true
  }
};


var write_html = function(code){
  // console.log(code);
  code = code.replace(/"\/static\/(favicon\/.*?)"/g, '"{% static \'$1\' %}"');
  code = '{% load gulp_rev_staticfiles %}\n' + code;
  // console.log(code);
  fs.writeFileSync(conf.files.html, code);
};


gulp.task('favicon', function () {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(favicons(conf, write_html))
    // .pipe(favicons(conf))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}));
});

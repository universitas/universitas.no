var config = require('../config');
if(!config.tasks.favicon) return;

var gulp = require('gulp');
var favicons = require('gulp-favicons');
var fs = require('fs');
var path = require('path');

var src = path.join(
  config.root.src, config.tasks.favicon.src);
var dest = path.join(
  config.root.dest, config.tasks.favicon.dest);

var conf = {
  files: {
    src: src,
    html: config.tasks.favicon.html,
    iconsPath: path.join(
      '/static/', config.tasks.favicon.dest)
  },
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
  fs.writeFileSync(conf.files.html, code);
};


gulp.task('favicon', function () {
  // console.log(conf);
  gulp.src(src)
    .pipe(favicons(conf, write_html))
    .pipe(gulp.dest(dest));
});

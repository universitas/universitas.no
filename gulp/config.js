var dest = "../build";
var src = './assets';

module.exports = {
  browserSync: {
    // use django's runserver on port 8000 for development
    proxy: 'localhost:8000'
  },
  scss: {
    src: src + "/scss/*.scss",
    watch: src + "/scss/**/*.*",
    dest: dest + "/css",
    options: {
      noCache: false,
      compass: false,
      bundleExec: true,
      sourcemap: true,
      includePaths: ['../bower_components/'],
      sourcemapPath: './'
    }
  },
  autoprefixer: {
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ],
    cascade: true
  },
  templates: {
    // look for changed django template files to trigger browserSync
    src: "./{apps,templates}/**/*.html",
    dest: dest + "/html"
  },
  browserify: {
    debug: true,
    bundleConfigs: [{
      // Site specific javascript
      entries: src + '/javascript/site.js',
      dest: dest + '/javascript/',
      outputName: 'universitas.js',
    }, {
      // Vendor javascript
      entries: src + '/javascript/vendor.js',
      dest: dest + '/javascript/',
      outputName: 'vendor.js',
    }, {
      // Modernizr must be loaded in html head to work best.
      entries: src + '/javascript/head.js',
      dest: dest + '/javascript/',
      outputName: 'universitas_head.js',
    }]
  },
  javascript: {
    src: src + '/javascript/**/*.js'
  },
  images: {
    src: src + '/images/**/*.*',
    dest: dest + '/images/'
  },
  fonts: {
    src: src + '/fonts/**/*.*',
    dest: dest + '/fonts/'
  },
  production: {
    // this task also minifies the assets.
    cssSrc: dest + '/css/*.css',
    jsSrc: dest + '/javascript/*.js',
    cssDst: dest + '/css/',
    jsDst: dest + '/javascript/'
  }
};

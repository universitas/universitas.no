module.exports = {
  root: {
    src: './src',
    dest: './build'
  },

  browserSync: {
    proxy: 'localhost:8000'
  },
  tasks: {
    js: {
      src: 'javascripts',
      dest: 'javascripts',
      extractSharedJs: false,
      entries: {
        head: [ './head.js' ],
        site: [ './site.js' ],
        vendor: [ './vendor.js' ]
      },
      extensions: ['js']
    },

    css: {
      src: 'stylesheets',
      dest: 'stylesheets',
      autoprefixer: {
        browsers: ['last 3 version'],
        cascade: true
      },
      sass: {
        indentedSyntax: false, // Enable .sass syntax (.scss still works too)
        includePaths: [
          'node_modules/zurb-foundation-5/scss/',
          'node_modules/slick-carousel/'
        ],
      },
      extensions: ['sass', 'scss', 'css']
    },

    html: {
      src: 'html',
      dest: './',
      dataFile: 'data/global.json',
      htmlmin: {
        collapseWhitespace: true
      },
      extensions: ['html', 'json'],
      excludeFolders: ['layouts', 'shared', 'macros', 'data']
      // watchOther: './app/views/*/**.html'
    },

    images: {
      src: 'images',
      dest: 'images',
      extensions: ['jpg', 'png', 'svg', 'gif']
    },

    fonts: {
      src: 'fonts',
      dest: 'fonts',
      extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
    },

    iconFont: {
      src: 'icons',
      dest: 'fonts',
      sassDest: 'generated',
      extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
    },

    svgSprite: {
      src: 'sprites',
      dest: 'images',
      extensions: ['svg']
    }
  }
};

var config = require('./');

module.exports = {
  autoprefixer: {
    browsers: ['last 2 version'],
    cascade: true
  },
  src: config.sourceAssets + "/stylesheets/*.{sass,scss}",
  dest: config.publicAssets + '/stylesheets',
  settings: {
    // noCache: false,
    // compass: false,
    // indentedSyntax: false, // Enable .sass syntax!
    includePaths: [
      'node_modules/zurb-foundation-5/scss/',
      'node_modules/slick-carousel/'
    ],
    imagePath: 'images' // Used by the image-url helper
  }
};

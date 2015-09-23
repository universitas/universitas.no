var config = require('./');

module.exports = {
  // use django's runserver on port 8000 for development
  proxy: 'localhost:8000'
  // server: {
  //   baseDir: config.publicDirectory
  // },
  // files: ['public/**/*.html']
};

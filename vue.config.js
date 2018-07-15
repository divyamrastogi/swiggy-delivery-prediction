const fs = require('fs');

module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        data: fs.readFileSync('src/assets/mixins.scss', 'utf-8'),
        filename: '[name].[ext]',
      },
    },
  },
};

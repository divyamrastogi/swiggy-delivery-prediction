const fs = require('fs');

module.exports = {
  devServer: {
    https: true,
  },
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

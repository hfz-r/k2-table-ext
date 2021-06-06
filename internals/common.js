const path = require('path');

module.exports = {
  path: {
    root: path.resolve(__dirname, '../'),
    outputPath: path.resolve(__dirname, '../', 'build'),
    entryPath: path.resolve(__dirname, '../', 'src/index.jsx'),
    templatePath: path.resolve(__dirname, '../', 'src/index.html'),
    imagesFolder: 'images',
    fontsFolder: 'fonts',
    cssFolder: 'css',
    jsFolder: 'js',
  },
};

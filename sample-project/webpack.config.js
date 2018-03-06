const DirectoryNamedPlugin = require("directory-named-webpack-plugin");

module.exports = {
  entry: './sample.js',

  output: {
    filename: 'bundle.js'
  },

  resolve: {
    plugins: [new DirectoryNamedPlugin({ honorIndex: true })]
  }
};
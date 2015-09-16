
## What
Normally, Webpack looks for **index** file when the path passed to `require` points to a directory; which means there may have a lot of **index** files.

This plugin makes it possible to use the name of the directory as the name of the entry file, makes it easier to find.

## Usage

Add the following to Webpack's config file:

```javascript
  var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

  plugins: [
    new webpack.ResolverPlugin(new DirectoryNamedWebpackPlugin())
  ]

```

Then when `require("component/foo")` and the path "component/foo" is resolved to a directory, Webpack will try to look for `component/foo/foo.js` as the entry.

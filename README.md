
### master requires Webpack V4, please use 2.x versions for Webpack V2.x & V3.x and 1.x versions for Webpack V1

[![NPM](https://nodei.co/npm/directory-named-webpack-plugin.png?downloads=true)](https://nodei.co/npm/directory-named-webpack-plugin/)

## What
Normally, Webpack looks for **index** file when the path passed to `require` points to a directory; which means there may have a lot of **index** files.

This plugin makes it possible to control what file within directory will be treated as entry file.

## Usage

Add the following to Webpack's config file:

```javascript
  var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
```

Then when `require("component/foo")` and the path "component/foo" is resolved to a directory, Webpack will try to look for `component/foo/foo.js` as the entry (given default options).

If there is also an index file, e.g. `index.js`, and it should be used as entry file instead of the file with the same name of directory, pass `true` as the first argument when creating new instance.

```javascript
  var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin(true)
    ]
  }
```

You can also pass in an options object to further customise the plugin:
```javascript
  var DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
  var path = require("path");

  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin({
        honorIndex: true | false, // defaults to false

        // respect "main" fields defined in package.json
        // if it's an Array, values will be used as name of the fields to check
        // defaults to true, which is the same as ["main"]
        honorPackage: true | false | ["main"],

        // if it's matching with resolving directory's path, plugin will ignore the custom resolving.
        // it can be string/regex or Array of string/regex.
        exclude: /node_modules/

        ignoreFn: function(webpackResolveRequest) {
          // custom logic to decide whether request should be ignored
          // return true if request should be ignored, false otherwise
          return false; // default
        },

        // define where the imported files will be resolving by DirectoryNamedWebpackPlugin.
        // it can be string/regex or Array of string/regex.
        include: [
          path.resolve('./app/components'),
          path.resolve('./app/containers')
        ]

        transformFn: function(dirName, dirPath, webpackResolveRequest) {
          // use this function to provide custom transforms of resolving directory name
          // return desired filename or array of filenames which will be used
          // one by one (honoring order) in attempts to resolve module
          return dirName; // default
        }

        // name of the resolver hook that should be tapped into
        // by default, uses "before-existing-directory"
        resolverHook: "before-existing-directory"
      })
    ]
  }
```

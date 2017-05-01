var path = require('path');
var assign = require('object-assign');
var forEachBail = require('enhanced-resolve/lib/forEachBail');
var basename = require('enhanced-resolve/lib/getPaths').basename;

module.exports = function (options) {
  var optionsToUse = (typeof options === 'boolean') ? { honorIndex: options } : (options || {});
  var {honorPackage: mainFields, exclude, include} = optionsToUse;
  optionsToUse.mainFields = mainFields !== false && !Array.isArray(mainFields) ? ["main"] : mainFields;
  // make exclude array if not
  optionsToUse.exclude = exclude && !Array.isArray(exclude) ? [exclude] : exclude;
  // make include array if not
  optionsToUse.include = include && !Array.isArray(include) ? [include] : include;
  return {
    apply: doApply.bind(this, optionsToUse)
  };
};

function doApply(options, resolver) {
  // plugin name taken from: https://github.com/webpack/enhanced-resolve/blob/7df23d64da27cd76b09046f9b9ffd61480c0ddca/test/plugins.js
  resolver.plugin('before-existing-directory', function (request, callback) {
    if (options.ignoreFn && options.ignoreFn(request)) {
      return callback();
    }

    var dirPath = request.path;
    var dirName = basename(dirPath);
    var attempts = [];

    // return if path matches with excludes
    if (options.exclude && options.exclude.some(exclude=> dirPath.search(exclude) >= 0)) {
      return callback();
    }

    // return if path doesn't match with includes
    if (options.include && !options.include.some(include=> dirPath.search(include) >= 0)){
      return callback();
    }

    if (options.mainFields) {
      try {
        var pkg = require(path.resolve(dirPath, "package.json"));
        options.mainFields.forEach(function(field) {
          pkg[field] && attempts.push(pkg[field]);
        });
      } catch (e) {
        // No problem, this is optional.
      }
    }

    if (options.honorIndex) {
      attempts.push('index');
    }

    if (options.transformFn) {
      var transformResult = options.transformFn(dirName);

      if (!Array.isArray(transformResult)) {
        transformResult = [transformResult];
      }

      transformResult = transformResult.filter(function (attemptName) {
        return typeof attemptName === 'string' && attemptName.length > 0;
      });

      attempts = attempts.concat(transformResult);
    } else {
      attempts.push(dirName);
    }

    forEachBail(
      attempts,

      function (fileName, innerCallback) {
        var filePath = resolver.join(dirPath, fileName);

        // approach taken from: https://github.com/webpack/enhanced-resolve/blob/master/lib/CloneBasenamePlugin.js#L21
        var obj = assign({}, request, {
          path: filePath,
          relativePath: request.relativePath &&
          resolver.join(request.relativePath, fileName)
        });

        // file type taken from: https://github.com/webpack/enhanced-resolve/blob/7df23d64da27cd76b09046f9b9ffd61480c0ddca/test/plugins.js
        resolver.doResolve('undescribed-raw-file', obj, 'using path: ' + filePath, wrap(innerCallback, fileName));
      },

      function (result) {
        return result ? callback(null, result) : callback();
      }
    );
  });
}

function wrap(callback, fileName) {
  function wrapper(err, result) {
    if (callback.log) {
      callback.log("directory name file " + fileName);
    }

    return err === null && result ? callback(result) : callback();
  }
  wrapper.log = callback.log;
  wrapper.stack = callback.stack;
  wrapper.missing = callback.missing;
  return wrapper;
}
var path = require("path");
module.exports = DirectoryNamedWebpackPlugin;

function DirectoryNamedWebpackPlugin(options) {
  var optionsToUse = typeof options === "boolean" ? { honorIndex : options } : (options || {});
  this.options = {
    honorIndex: optionsToUse.honorIndex,
    honorPackage: optionsToUse.honorPackage !== false,
    ignoreFn: optionsToUse.ignoreFn || noop
  };
}

DirectoryNamedWebpackPlugin.prototype.apply = function (resolver) {
  resolver.plugin("directory", resolveDirectory(this.options));
};

function resolveDirectory(options) {
  return function (request, callback) {
    if (options.ignoreFn(request)) {
      return callback();
    }
    var _this = this;
    var dirPath = _this.join(request.path, request.request);
    var dirName = dirPath.substr(dirPath.lastIndexOf(path.sep) + path.sep.length);
    _this.fileSystem.stat(dirPath, function (err, stat) {
      if (err || !stat || !stat.isDirectory()) {
        callback.log && callback.log(dirPath + " doesn't exist or is not a directory (directory named)");
        return callback();
      }

      var attempts = []

      if (options.honorPackage) {
        try {
          var mainFilePath = require(path.resolve(dirPath, 'package.json')).main;
          attempts.push(mainFilePath);
        } catch (e) {
          // No problem, this is optional.
        }
      }

      if (options.honorIndex) {
        attempts.push("index");
      }

      attempts.push(dirName)

      _this.forEachBail(
        attempts,
        function (file, innerCallback) {
          var fileRequest = { path: dirPath, query: request.query, request: file };
          _this.doResolve("file", fileRequest, wrap(innerCallback, file));
        },
        function (result) {
          return result ? callback(null, result) : callback();
        }
      );
    });
  };
}

function wrap(callback, file) {
  function wrapper(err, result) {
    if (callback.log) {
      callback.log("directory name file " + file);
    }
    return !err && result ? callback(result) : callback();
  }
  wrapper.log = callback.log;
  wrapper.stack = callback.stack;
  wrapper.missing = callback.missing;
  return wrapper;
}

function noop() {}

var path = require("path");
module.exports = DirectoryNamedWebpackPlugin;

function DirectoryNamedWebpackPlugin() {}

DirectoryNamedWebpackPlugin.prototype.apply = function(resolver) {
	resolver.plugin("directory", resolveDirectory);
};

function resolveDirectory(request, callback) {
	var directory = this.join(request.path, request.request);
	var file = directory.substr(directory.lastIndexOf(path.sep) + path.sep.length);
	var fileRequest = { path: directory, query: request.query, request: file };
	this.doResolve("file", fileRequest, wrap(callback, file));
}

function wrap(callback, file) {
	function wrapper(err, result) {
		if (callback.log) {
			callback.log("directory name file " + file);
		}
		return !err && result ? callback(null, result) : callback();
	}
	wrapper.log = callback.log;
	wrapper.stack = callback.stack;
	wrapper.missing = callback.missing;
	return wrapper;
}

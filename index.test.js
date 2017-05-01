var ResolverFactory = require("enhanced-resolve").ResolverFactory;
var plugin = require("./index.js");
var path = require("path");

var createResolver = options =>
  ResolverFactory.createResolver({
    fileSystem: require("fs"),
    plugins: [new plugin(options)]
  });

describe("Simple matches", () => {
  it("basicDir/ should match to basicDir/basicDir.js", done => {
    var resolver = createResolver();
    resolver.resolve({}, __dirname, "./__mocks__/basicDir", function(
      err,
      result
    ) {
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/basicDir/basicDir.js")
      );
      done();
    });
  });

  it("HonorDir/ should honor package and match to HonorDir/foo.js", done => {
    var resolver = createResolver();
    resolver.resolve({}, __dirname, "./__mocks__/HonorDir", function(
      err,
      result
    ) {
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/foo.js")
      );
      done();
    });
  });
});

describe("Honor options (honorIndex and honorPackage)", () => {
  it("HonorDir/ should honor index and match to HonorDir/index.js", done => {
    var resolver = createResolver({
      honorIndex: true,
      honorPackage: false
    });
    resolver.resolve({}, __dirname, "./__mocks__/HonorDir", function(
      err,
      result
    ) {
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/index.js")
      );
      done();
    });
  });

  it("HonorDir/ should match to HonorDir/HonorDir.js when honor properties are false", done => {
    var resolver = createResolver({
      honorIndex: false,
      honorPackage: false
    });
    resolver.resolve({}, __dirname, "./__mocks__/HonorDir", function(
      err,
      result
    ) {
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/HonorDir.js")
      );
      done();
    });
  });
});

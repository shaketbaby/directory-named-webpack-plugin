var ResolverFactory = require("enhanced-resolve").ResolverFactory;
var plugin = require("./index.js");
var path = require("path");

var createResolver = options =>
  ResolverFactory.createResolver({
    fileSystem: require("fs"),
    plugins: [new plugin(options)]
  });

describe("Directory Named Webpack Plugin", () => {
  it("basicDir/ should match with basicDir.js", done => {
    var resolver = createResolver();
    resolver.resolve({}, __dirname, "./__mocks__/basicTest", function(
      err,
      result
    ) {
      if (err) return done(err);
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/basicTest/basicTest.js")
      );
      done();
    });
  });

  it("HonorDir/ should honor package and match to foo.js", done => {
    var resolver = createResolver();
    resolver.resolve({}, __dirname, "./__mocks__/HonorPackage", function(
      err,
      result
    ) {
      if (err) return done(err);
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/foo.js")
      );
      done();
    });
  });

  it("HonorDir/ should honor index and match to index.js", done => {
    var resolver = createResolver({
      honorIndex: true,
      honorPackage: false
    });
    resolver.resolve({}, __dirname, "./__mocks__/HonorPackage", function(
      err,
      result
    ) {
      if (err) return done(err);
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/index.js")
      );
      done();
    });
  });

  it("HonorDir/ should match to HonorDir.js when honor properties are false", done => {
    var resolver = createResolver({
      honorIndex: false,
      honorPackage: false
    });
    resolver.resolve({}, __dirname, "./__mocks__/HonorPackage", function(
      err,
      result
    ) {
      if (err) return done(err);
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/HonorDir/HonorDir.js")
      );
      done();
    });
  });
});

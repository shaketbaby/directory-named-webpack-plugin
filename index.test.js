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

describe("include, exclude and ignoreFn options", () => {
  it("basicDir/ should return undefined with regex exclude", done => {
    var resolver = createResolver({ exclude: /basicDir/ });
    resolver.resolve({}, __dirname, "./__mocks__/basicDir", function(
      err,
      result
    ) {
      expect(result).toBeUndefined();
      done();
    });
  });

  it("basicDir/ should return undefined with array of regex exclude", done => {
    var resolver = createResolver({
      exclude: [/other_regex_pattern/, /\/.+Dir/]
    });
    resolver.resolve({}, __dirname, "./__mocks__/basicDir", function(
      err,
      result
    ) {
      expect(result).toBeUndefined();
      done();
    });
  });

  it("basicDir/ should match to basicDir/basicDir.js with unrelated exclude", done => {
    var resolver = createResolver({ exclude: /node_modules/ });
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

  it("HonorDir/ should match with regular resolver because of include mismatch", done => {
    var resolver = createResolver({
      include: /other_regex_pattern/,
      honorPackage: false
    });
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

  it("basicDir/ should match to basicDir/basicDir.js with string include", done => {
    var resolver = createResolver({ include: "__mocks__/" });
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

  it("basicDir/ should match to basicDir/basicDir.js with array of regex include", done => {
    var resolver = createResolver({
      include: [/components\//, /dir/i, /other_regex_pattern/]
    });
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

  it("basicDir/ should match to basicDir/basic.js with transformFn", done => {
    var resolver = createResolver({
      transformFn: dirName => [dirName.replace("Dir", ""), dirName]
    });
    resolver.resolve({}, __dirname, "./__mocks__/basicDir", function(
      err,
      result
    ) {
      expect(result).toEqual(
        path.resolve(__dirname, "./__mocks__/basicDir/basic.js")
      );
      done();
    });
  });
});

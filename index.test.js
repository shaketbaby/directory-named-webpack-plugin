var ResolverFactory = require("enhanced-resolve").ResolverFactory;
var plugin = require("./index.js");
var path = require("path");

describe("Simple matches", () => {
  it("basicDir/ should match to basicDir/basicDir.js", resolveAndCheck(
    "./__mocks__/basicDir",
    "./__mocks__/basicDir/basicDir.js"
  ));

  it("HonorDir/ should honor package and match to HonorDir/foo.js", resolveAndCheck(
    "./__mocks__/HonorDir",
    "./__mocks__/HonorDir/foo.js"
  ));
});

describe("Honor options (honorIndex and honorPackage)", () => {
  it("HonorDir/ should honor index and match to HonorDir/index.js", resolveAndCheck(
    "./__mocks__/HonorDir",
    "./__mocks__/HonorDir/index.js",
    { honorIndex: true, honorPackage: false }
  ));

  it("HonorDir/ should match to HonorDir/HonorDir.js when honor properties are false", resolveAndCheck(
    "./__mocks__/HonorDir",
    "./__mocks__/HonorDir/HonorDir.js",
    { honorIndex: false, honorPackage: false }
  ));
});

describe("include, exclude and ignoreFn options", () => {
  it("basicDir/ should return undefined with regex exclude", resolveAndCheck(
    "./__mocks__/basicDir", undefined, { exclude: /basicDir/ }
  ));

  it("basicDir/ should return undefined with array of regex exclude", resolveAndCheck(
    "./__mocks__/basicDir", undefined, { exclude: [/other_regex_pattern/, "\\" + path.sep + ".+Dir"] }
  ));

  it("basicDir/ should match to basicDir/basicDir.js with unrelated exclude", resolveAndCheck(
    "./__mocks__/basicDir",
    "./__mocks__/basicDir/basicDir.js",
    { exclude: /node_modules/ }
  ));

  it("HonorDir/ should match with regular resolver because of include mismatch", resolveAndCheck(
    "./__mocks__/HonorDir",
    "./__mocks__/HonorDir/foo.js",
    { include: /other_regex_pattern/, honorPackage: false }
  ));

  it("basicDir/ should match to basicDir/basicDir.js with string include", resolveAndCheck(
    "./__mocks__/basicDir",
    "./__mocks__/basicDir/basicDir.js",
    { include: "__mocks__\\" + path.sep }
  ));

  it("basicDir/ should match to basicDir/basicDir.js with array of regex include", resolveAndCheck(
    "./__mocks__/basicDir",
    "./__mocks__/basicDir/basicDir.js",
    { include: ["components\\" + path.sep, /dir/i, /other_regex_pattern/] }
  ));

  it("basicDir/ should match to basicDir/basic.js with transformFn", resolveAndCheck(
    "./__mocks__/basicDir",
    "./__mocks__/basicDir/basic.js",
    { transformFn: dirName => [dirName.replace("Dir", ""), dirName] }
  ));
});

function resolveAndCheck(pathToResolve, expectedPath, options) {
  return (done) => {
    const resolver = ResolverFactory.createResolver({
      fileSystem: require("fs"),
      plugins: [new plugin(options)]
    });
    resolver.resolve({}, __dirname, pathToResolve, {}, (err, result) => {
      if (err) { return done(err); }
      expect(result).toEqual(path.resolve(__dirname, expectedPath));
      done();
    });
  }
}

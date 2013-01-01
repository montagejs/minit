var jasmine = require("jasmine-node");
var SandboxedModule = require('sandboxed-module');

var TemplateBase = require("../../lib/template-base").TemplateBase;

var QMock = require("q-io/fs-mock");

describe("template-base", function () {
    var base;

    it("should be correctly initialized ", function () {
        var directory = "directory";
        base = TemplateBase.newWithDirectory(directory);

        expect(base.directory).toBe(directory);

     });

    describe("generate files based on template", function () {
        var testTemplate;
        var templateConfig;
        var aMockQFS;

        beforeEach(function() {
            aMockQFS = QMock({
                "minit_home/templates": {
                    "testTemplate": {
                        "__name__-test.js": 1
                    },
                    "testTemplate.js": 1
                },
                "package_home": {
                   "package.json": 1
                }
            });

            templateConfig = {};
            templateConfig.minitHome = "/minit_home";
            templateConfig.packageHome = "/package_home";
            templateConfig.templatesDir = "/minit_home/templates";

            var TemplateBase = SandboxedModule.require("../../lib/template-base", {
                requires: {
                    "q-io/fs": aMockQFS
                }
            }).TemplateBase;

            var TestTemplate = Object.create(TemplateBase);

            testTemplate = TestTemplate.newWithDirectory("/minit_home/templates/testTemplate");

            templateConfig.templateName = "testTemplate";
        });

        it("should rename generated files", function () {
            templateConfig.name = "mine";
            return testTemplate.process(templateConfig)
                .then(function() {
                    return aMockQFS.exists("/package_home/mine-test.js");
                })
                .then(function(exists) {
                    expect(exists).toBe(true);
                });
        });
    });
});
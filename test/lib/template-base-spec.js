var jasmine = require("jasmine-node");
var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;

var TemplateBase = require("../../lib/template-base").TemplateBase;

var QMock = require("q-io/fs-mock");

describe("template-base", function () {
    var base;

    it("should be correctly initialized ", function () {
        var directory = "directory";
        base = TemplateBase.newWithDirectory(directory);

        expect(base.directory).toBe(directory);

     });

    describe("default template options", function () {
        var testCommand;
        var Template;
        beforeEach(function() {

            Template = SandboxedModule.require('../../lib/template-base').TemplateBase;

            testCommand = new Command();

        });
        it("should have a --destination option", function () {

                var command = Object.create(Template).addOptions(testCommand);

                expect(command.optionFor("-d")).toBeDefined();
                expect(command.optionFor("--destination")).toBeDefined();

        });

        it("should have --package-home option", function () {

            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-p")).toBeDefined();
            expect(command.optionFor("--package-home")).toBeDefined();
        });

    });

    describe("generate files based on template", function () {
        var testTemplate;
        var templateConfig;
        var aMockQFS;
        var osMock;

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

            osMock = {
                tmpDir: function() {
                    return "/minit_home"
                }
            }

            templateConfig = {};
            templateConfig.minitHome = "/minit_home";
            templateConfig.packageHome = "/package_home";
            templateConfig.templatesDir = "/minit_home/templates";

            var TemplateBase = SandboxedModule.require("../../lib/template-base", {
                requires: {
                    "q-io/fs": aMockQFS,
                    "os": osMock
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

        it("should expand the template at the specified destination", function () {
            templateConfig.name = "mine";
            templateConfig.destination = "destination";
            return testTemplate.process(templateConfig)
                .then(function() {
                    return aMockQFS.exists("/package_home/destination/mine-test.js");
                })
                .then(function(exists) {
                    expect(exists).toBe(true);
                });
        });

        it("interpolates strings correctly", function () {
            var result = testTemplate.applyTransform("before {{replace}} after", {replace: "a/b/c"});
            expect(result).toEqual("before a/b/c after");
        });
    });
});
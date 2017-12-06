var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;

describe("app template", function () {
    var testCommand;
    var Template;
    beforeEach(function() {

        Template = SandboxedModule.require('../../templates/app', {
            requires: {
                '../lib/template-base': {
                    TemplateBase: {
                        addOptions: function(command) {
                            return command;
                        }
                    }
                }
            }
        }).Template;

        testCommand = new Command();

    });

    it("should have a commandDescription defined on prototype", function () {
        expect(Template.commandDescription).toBeDefined();
    });

    it("should return the command from addOptions", function () {
        expect(Object.create(Template).addOptions(testCommand)).toBe(testCommand);
    });

    describe("command", function () {

        it("should have --name option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-n")).toBeDefined();
            expect(command.optionFor("--name")).toBeDefined();
        });

        it("should have --copyright option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-c")).toBeDefined();
            expect(command.optionFor("--copyright")).toBeDefined();
        });
    });
    describe("option validation", function () {
        var template;
        var options;
        beforeEach(function () {
            template = Object.create(Template);
            options = {};
        });
        it("should throw an error when no name given", function () {
            expect(function () {
                template.didSetOptions(options);
            }).toThrow("Required name option missing");
        });
        it("should accept name with dashes", function () {
            options.name = "my-app";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app");
        });
        it("should accept name with spaces", function () {
            options.name = "my app";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app");
        });
        it("should accept camelCased name", function () {
            options.name = "MyApp";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app");
        });
        it("should accept camelCased name", function () {
            options.name = "MyApp";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app");
        });
        it("should convert spaces to dashes in names", function () {
            options.name = "My App";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app");
        });
        it("should convert multiple spaces to dashes in names", function () {
            options.name = "My App Has Spaces";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-app-has-spaces");
        });
        // by converting accented characters to ascii equivalents in names
        it("should respect NPM package name conventions (râțéăü -> rateau)", function () {
            options.name = "râțéăü";
            template.didSetOptions(options);
            expect(options.name).toEqual("rateau");
        });
        it("should generate description", function () {
            options.name = "MyApp";
            template.didSetOptions(options);
            expect(options.description).toEqual("MyApp Application");
        });
        it("should generate description", function () {
            options.name = "MyApp";
            options.description = "Test description"
            template.didSetOptions(options);
            expect(options.description).toEqual("Test description");
        });
    });
});

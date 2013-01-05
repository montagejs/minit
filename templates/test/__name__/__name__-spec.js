var Montage = require("montage").Montage;
var TestPageLoader = require("montage-testing/testpageloader").TestPageLoader;

TestPageLoader.queueTest("{{name}}-test", function(testPage) {

    describe("test/{{name}}/{{name}}-spec", function() {
        it("should load", function() {
            expect(testPage.loaded).toBe(true);
        });

        describe("{{title}}", function() {
            it("can be created", function() {
                expect(testPage.test.{{propertyName}}).toBeDefined();
            });
        });
    });
});

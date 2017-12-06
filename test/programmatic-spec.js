/*global xdescribe */
xdescribe("programmatic", function() {
    var minitCreate = require("../main").create;

    minitCreate("app", {
        name: "newFooApps",
        packageHome: "/Users/francois/declarativ/tools/minit_test/package"
    }).done();
});
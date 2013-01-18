{{#copyright}}/* {{{copyright}}} */

{{/copyright}}
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

exports.Main = Montage.create(Component, {

    thing: {
        value: "World"
    }

});

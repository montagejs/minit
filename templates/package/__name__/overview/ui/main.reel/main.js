{{#copyright}}/* {{{copyright}}} */

{{/copyright}}
var Component = require("montage/ui/component").Component;

exports.Main = Component.specialize(Component, {

    thing: {
        value: "World"
    }

});

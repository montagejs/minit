var Montage = require("montage").Montage,
    Enumeration = require("montage/data/model/enumeration").Enumeration,
    DataObjectDescriptor = require("montage/data/model/data-object-descriptor").DataObjectDescriptor;

exports.{{exportedName}} = Montage.specialize(/** @lends {{exportedName}}.prototype */ {
    temp: {
        value: null
    },
    constructor: {
        value: function {{exportedName}}() {}
    }
}, {

    //////////////////////////////////////////////////////////////////////
    // Montage data
    /**
     * The Montage Data type of features.
     *
     * @type {external:ObjectDescriptor}
     */
    objectPrototype: {
        get: function () {
            return exports.{{exportedName}};
        }
    }
});

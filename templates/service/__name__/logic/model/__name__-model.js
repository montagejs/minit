var Montage = require("montage").Montage

/**
 * @class
 * @extends external:Montage
 */
exports.{{exportedName}} = Montage.specialize(/** @lends {{exportedName}}.prototype */ {

    /**
     * The unique identifier for this {{name}}
     * @type {number}
     */
    id: {
        value: undefined
    },

    /**
     * The {{name}}'s subject.
     * @type {string}
     */
    subject: {
        value: undefined
    },

    /**
     * The {{name}}'s text.
     * @type {string}
     */
    text: {
        value: undefined
    },

    created: {
        value: undefined
    },

    updated: {
        value: undefined
    }

}, {
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

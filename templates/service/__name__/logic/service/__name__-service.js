var HttpService = require("montage/data/service/http-service").HttpService,
    MontagePromise = require("montage/core/promise").Promise;

var STORE = Map.from({
    42: {
        "id": 42,
        "subject": "You've got mail",
        "text": "Hello World!",
        "create": Date.now()
    }
});

var AUTO_INCREMENT_ID = 43;

var dataStore = {
    all: function () {
        return Array.from(STORE);
    },
    filterBy: function (prop, value) {
        return Array.from(STORE).filter(function (rawDataEntry) {
            return rawDataEntry[prop] === value;
        });
    },
    set: function (key, value) {
        return STORE.set(key, value);
    },
    get: function (key) {
        return STORE.get(key);  
    },
    delete: function (key) {
        return STORE.delete(key);   
    }
};

var {{exportedName}} = require('logic/model/{{name}}-model');

/**
 * Provides {{exportedName}}
 *
 * @class
 * @extends external:HttpService
 */
exports.{{exportedName}}Service = HttpService.specialize(/** @lends {{exportedName}}Service.prototype */ {

    // TODO
    // Cause Can\'t fetch data of unknown type
    // Need to me module not object
    /*
    types: {
        value: [{{exportedName}}]
    },
    */

    //==========================================================================
    // Entry points
    //==========================================================================

    // Get and query
    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                criteria = query.criteria,
                parameters = criteria.parameters;

            if (parameters && parameters.id) {
                var rawData = dataStore.filterBy('id', parameters.id);
                self.addRawData(stream, rawData);
                self.rawDataDone(stream);
            } else {
                MontagePromise.resolve(dataStore.all()).then(function (rawData) {
                    self.addRawData(stream, rawData);
                    self.rawDataDone(stream);
                });
            }
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {

            // Update rawData
            if (this.rootService.createdDataObjects.has(object)) {
                AUTO_INCREMENT_ID++;
                rawData.id = AUTO_INCREMENT_ID;
                rawData.created = Date.now();
                Object.assign(object, rawData);
            } else {
                object.updated = rawData.updated = Date.now();
            }

            // Update store
            dataStore.set(rawData.id, rawData);

            return MontagePromise.resolve(rawData);
        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            dataStore.delete(rawData.id);
            return MontagePromise.resolve(rawData);
        }
    }
});

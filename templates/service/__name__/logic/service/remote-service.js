var Montage = require("montage").Montage,
    HttpService = require("montage/data/service/http-service").HttpService,
    ObjectDescriptor = require("montage/core/meta/object-descriptor").ObjectDescriptor,
    RawDataService = require("montage/data/service/raw-data-service").RawDataService,
    Promise = require("montage/core/promise").Promise;

var serialize = require("montage/core/serialization/serializer/montage-serializer").serialize;
var deserialize = require("montage/core/serialization/deserializer/montage-deserializer").deserialize;
var io = require('socket.io-client/dist/socket.io');

/**
 * Provides AbstractRemoteService
 *
 * @class
 * @extends external:AbstractRemoteService
 */
exports.AbstractRemoteService = {

   _serialize: {
        value: function (dataObject) {
            
            var self = this,
                objectJSON = serialize(dataObject, require);
            return self._deserialize(objectJSON).then(function () {
                //console.log('_serialize', objectJSON, dataObject);
                return objectJSON;
            });
        }
    },

    _deserialize: {
        value: function (objectJSON) {
            return deserialize(objectJSON, require).then(function (dataObject) {
                //console.log('_deserialize', objectJSON, dataObject);
                return dataObject;
            });
        }
    },

    deserializeSelf: {
        value:function (deserializer) {
            this.super(deserializer);
            value = deserializer.getProperty("serviceReferences");
            if (value) {
                this.registerServiceReferences(value);
            }
        }
    },

    //
    // Service Reference
    //

    _referenceService: {
        value: undefined
    },

    _referenceServicesByType: {
        value: undefined
    },

    referenceService: {
        get: function() {
            if (!this._referenceService) {
                this._referenceService = new Set();
            }
            return this._referenceService;
        }
    },

    referenceServicesByType: {
        get: function () {
            if (!this._referenceServicesByType) {
                this._referenceServicesByType = new Map();
            }
            return this._referenceServicesByType;
        }
    },

    referenceServiceForType: {
        value: function (type) {
            var services;
            type = type instanceof ObjectDescriptor ? type : this._objectDescriptorForType(type);
            services = this._referenceServicesByType.get(type) || this._referenceServicesByType.get(null);
            return services && services[0] || null;
        }
    },

    registerServiceReferences: {
        value: function (referenceServices) {
            var self;
            if (!this.__referenceServiceRegistrationPromise) {
                self = this;
                this.__referenceServiceRegistrationPromise = Promise.all(referenceServices.map(function (service) {
                    return self.registerServiceReference(service);
                }));
            }
        }
    },

    registerServiceReference: {
        value: function (service, types) {
            var self = this;
            // possible types
            // -- types is passed in as an array or a single type.
            // -- a model is set on the service.
            // -- types is set on the service.
            // any type can be asychronous or synchronous.
                types = types && Array.isArray(types) && types ||
                        types && [types] ||
                        service.model && service.model.objectDescriptors ||
                        service.types && Array.isArray(service.types) && service.types ||
                        service.types && [service.types] ||
                        [];

            return self._registerServiceReferenceTypes(service, types);
        }
    },

    _registerServiceReferenceTypes: {
        value: function (service, types) {
            var self = this;
            return this._resolveAsynchronousTypes(types).then(function (descriptors) {
                self._registerTypesByModuleId(descriptors);
                self._addReferenceService(service, types);
                return null;
            });
        }
    },

    _addReferenceService: {
        value: function (service, types) {
            var serviceren, type, i, n, nIfEmpty = 1;
            types = types || service.model && service.model.objectDescriptors || service.types;
            
            // Add the new service to this service's serviceren set.
            this.referenceService.add(service);

            // Add the new service service to the services array of each of its
            // types or to the "all types" service array identified by the
            // `null` type, and add each of the new service's types to the array
            // of service types if they're not already there.
            for (i = 0, n = types && types.length || nIfEmpty; i < n; i += 1) {
                type = types && types.length && types[i] || null;
                serviceren = this.referenceServicesByType.get(type) || [];
                serviceren.push(service);
                if (serviceren.length === 1) {
                    this.referenceServicesByType.set(type, serviceren);
                }
            }
        }
    },

    //==========================================================================
    // Entry points
    //==========================================================================

    _performOperation: {
        value: function (action, data, service) {
            return Promise.reject('Not Implemented');
        }
    },

    // Get and query
    fetchRawData: {
        value: function (stream) {
            var self = this,
                action = 'fetchData',
                query = stream.query,
                service = self.referenceServiceForType(query.type);

            return self._serialize(service).then(function (serviceJSON) {
                return self._serialize(query).then(function (queryJSON) {
                    return self._performOperation(action, queryJSON, serviceJSON).then(function (remoteDataJson) {
                        return self._deserialize(remoteDataJson).then(function (remoteData) {
                            stream.addData(remoteData);
                            stream.dataDone();
                        });
                    }); 
                });
            }); 
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {
            var self = this,
                action = 'saveDataObject',
                type = self.objectDescriptorForObject(object),
                service = self.referenceServiceForType(type);
                
            return self._serialize(service).then(function (serviceJSON) {
                return self._serialize(object).then(function (dataObjectJSON) {
                    return self._performOperation(action, dataObjectJSON, serviceJSON).then(function (remoteObjectJSON) {
                        return self._deserialize(remoteObjectJSON).then(function (remoteObject) {
                            return self._mapRawDataToObject(remoteObject, object);
                        });
                    });
                }); 
            });
        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            var self = this,
                action = 'deleteDataObject',
                type = self.objectDescriptorForObject(object),
                service = self.referenceServiceForType(type);

            return self._serialize(service).then(function (serviceJSON) {
                return self._serialize(object).then(function (dataObjectJSON) {
                    return self._performOperation(action, dataObjectJSON, serviceJSON);
                }); 
            });
        }
    }
};

/*
 * Provides RemoteService and  HttpRemoteService
 *
 * @class
 * @extends external:RemoteService
 */
exports.HttpRemoteService = HttpService.specialize(exports.AbstractRemoteService).specialize(/** @lends RemoteService.prototype */ {

    _baseUrl: {
        value: '/api/data'
    },

    _actionsToPaths: {
        value: {
            'fetchData': '',
            'saveDataObject': '/save',
            'deleteDataObject': '/delete'
        }
    },

    constructor: {
        value: function HttpRemoteService() {
            // TODO opts
        }
    },

    _performOperation: {
        value: function (action, data, service) {
            var body, url, headers, 
                self = this;

            if (!self._actionsToPaths.hasOwnProperty(action)) {
                return Promise.reject('Invalid action "' + action + '"');
            } else if (!data) {
                return Promise.reject('Missing or invalid data');
            }
            
            url = self._baseUrl + self._actionsToPaths[action];

            if (action !== 'fetchData') {
                headers = {
                    "Content-Type": "application/json"
                };
                body = JSON.stringify({
                    data: data,
                    service: service
                });
            } else {
                url += '?query=' + encodeURIComponent(data) + '&service=' + encodeURIComponent(service);
            }   

            return self.fetchHttpRawData(url, headers, body, false);
        }  
    } 
});

/*
 * Provides WebSocketRemoteService
 *
 * @class
 * @extends external:WebSocketRemoteService
 */
exports.WebSocketRemoteService = RawDataService.specialize(exports.AbstractRemoteService).specialize(/** @lends WebSocketRemoteService.prototype */ {

    _baseUrl: {
        value: ''
    },

    _socket: {
        value: null
    },

    _socketOptions: {
        value: {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        }
    },

    constructor: {
        value: function WebSocketRemoteService() {
            this._getSocket();
        }
    },

    _getSocket: {
        value: function () { 
            var self = this;
            return self._socket ? self._socket : (self._socket = new Promise(function (resolve, reject) {  
                // Setup
                var socket = io.connect(self._baseUrl, self._socketOptions);
                socket.on('connect', function() {
                    // TODO
                    //console.log('worked...');
                });
                socket.on('disconnect', function() {
                    // TODO
                    //console.log('disconnected...');
                });

                socket.on('fetchData', function() {
                    // TODO
                    // dispatch result ? on main root service
                });

                socket.on('saveDataObject', function() {
                    // TODO
                    // dispatch on main root service
                });

                socket.on('deleteDataObject', function() {
                    // TODO
                    // dispatch on main root service
                });

                resolve(socket);
            }));
        }
    },

    _performOperation: {
        value: function (action, data) {
            var self = this;
            return self._getSocket().then(function (socket) {
                return new Promise(function (resolve, reject) {  
                    socket.emit(action, data, function(res) {
                        // TODO handle error reject     
                        resolve(res);
                    }); 
                });
            });
        }
    }
});

/*
 * Provides WorkerRemoteService
 *
 * @class
 * @extends external:WorkerRemoteService
 */
exports.WorkerRemoteService = RawDataService.specialize(exports.AbstractRemoteService).specialize(/** @lends WorkerRemoteService.prototype */ {

    constructor: {
        value: function WorkerRemoteService() {
            this._getWorker();
        }
    },

    _getWorker: function () {

    },

    _performOperation: function () {

    }
});

exports.RemoteService = exports.HttpRemoteService;
//exports.RemoteService = exports.WebSocketRemoteService;

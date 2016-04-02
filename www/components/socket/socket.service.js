/* global io */
'use strict';

angular.module('preserveusMobile')
    .factory('SocketService', function(angularLoad, $q, socketFactory, Auth, CONSTANTS) {

        var socket = null;

        return {
            getSocket: function() {
                var deferred = $q.defer();

                if (!socket) {
                    angularLoad.loadScript(CONSTANTS.SOCKET_IO_URL + '/socket.io-client/socket.io.js').then(function() {
                        // socket.io now auto-configures its connection when we ommit a connection url
                        var ioSocket = io(CONSTANTS.SOCKET_IO_URL, {
                            // Send auth token on connection, you will need to DI the Auth service above
                            'query': 'token=' + Auth.getToken(),
                            path: '/socket.io-client'
                        });

                        socket = socketFactory({
                            ioSocket: ioSocket,
                            prefix: ''
                        });

                        deferred.resolve(socket);

                    }).catch(function() {
                        deferred.reject('error');
                    });
                } else {
                    deferred.resolve(socket);
                }

                return deferred.promise;
            },

            /**
             * Register listeners to sync an array with updates on a model
             *
             * Takes the array we want to sync, the model name that socket updates are sent from,
             * and an optional callback function after new items are updated.
             *
             * @param {String} modelName
             * @param {Array} array
             * @param {Function} cb
             */
            syncUpdates: function(modelName, array, cb) {
                cb = cb || angular.noop;

                this.getSocket().then(function(socket) {
                    /**
                     * Syncs item creation/updates on 'model:save'
                     */

                    socket.on(modelName + ':save', function(item) {
                        var oldItem = _.find(array, { _id: item._id });
                        var index = array.indexOf(oldItem);
                        var event = 'created';

                        // replace oldItem if it exists
                        // otherwise just add item to the collection
                        if (oldItem) {
                            array.splice(index, 1, item);
                            event = 'updated';
                        } else {
                            array.push(item);
                        }

                        cb(event, item, array);
                    });

                    /**
                     * Syncs removed items on 'model:remove'
                     */
                    socket.on(modelName + ':remove', function(item) {
                        var event = 'deleted';
                        _.remove(array, { _id: item._id });
                        cb(event, item, array);
                    });
                });

            },

            /**
             * Removes listeners for a models updates on the socket
             *
             * @param modelName
             */

            unsyncUpdates: function(modelName) {
                this.getSocket().then(function(socket) {
                    socket.removeAllListeners(modelName + ':save');
                    socket.removeAllListeners(modelName + ':remove');
                });

            },

            init: function() {
                //listen to all app events.

                var events = ['chatDetail:save'];

                this.getSocket().then(function(socket){
                    socket.forward(events);
                });

            }
        };
    });

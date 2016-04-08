/* global io */
'use strict';

angular.module('preserveusMobile')
    .factory('SocketService', function ($rootScope, $q, socketFactory, Auth, CONSTANTS, DebugService) {

        window.localStorage.debug = '*';

        var hasBeenInitialized = false;
        var socket = null;

        return {
            createSocket: function () {
                socket = io(CONSTANTS.SOCKET_IO_URL, {
                    // Send auth token on connection, you will need to DI the Auth service above
                    'query': 'token=' + Auth.getToken(),
                    path: '/socket.io-client'
                });

                //console.log(ioSocket);

                //Don't use the AngularJS crap

                //socket = socketFactory({
                //    ioSocket: ioSocket,
                //    prefix: ''
                //});

                DebugService.log('SocketService - socket created');

                socket.on("error", function (error) {
                    if (error.type === "UnauthorizedError" || error.code === "invalid_token") {
                        // redirect user to login page perhaps?
                        DebugService.log("User's token has expired -- logging out");

                        $rootScope.logout();
                    }

                    DebugService.log(error);
                });

                socket.on("connect", function () {
                    DebugService.log('connected');
                });

                socket.on("reconnect", function () {
                    DebugService.log('reconnect');
                });

                socket.on("reconnect", function () {
                    DebugService.log('reconnect');
                });

                socket.on("reconnect_failed", function () {
                    DebugService.log('reconnect_failed');
                });

                socket.on("disconnect", function () {
                    DebugService.log('disconnect');
                });

            },

            init: function() {

                if (!hasBeenInitialized) {
                    hasBeenInitialized = true;
                    DebugService.log('socket service init');

                    this.createSocket();

                    //listen to all app events.
                    //var events = ['chatDetail:save'];

                    //socket.forward(events);

                    socket.on('chatDetail:save', function (data) {
                        $rootScope.$broadcast('chatDetail:save', data);
                    });
                }

            }
        };
    });

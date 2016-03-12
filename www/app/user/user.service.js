'use strict';

angular.module('preserveusMobile')
    .factory('User', function($resource, CONSTANTS) {
        return $resource(CONSTANTS.DOMAIN + '/api/users/:id/:controller', {
            id: '@_id'
        }, {
            changePassword: {
                method: 'PUT',
                params: {
                    controller: 'password'
                }
            },
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                params: {
                    id: 'me'
                }
            },
            profile: {
                method: 'GET',
                url: CONSTANTS.DOMAIN + '/api/users/:id/profile'
            },
            save: {
                method: 'POST',
                url: CONSTANTS.DOMAIN + '/api/users/mobile'
            }
        });
    });

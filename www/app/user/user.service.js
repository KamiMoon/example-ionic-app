'use strict';

angular.module('preserveusMobile')
    .factory('User', function($resource) {
        return $resource('/api/users/:id/:controller', {
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
                url: 'api/users/:id/profile'
            },
            save: {
                method: 'POST',
                url: 'api/users/mobile'
            }
        });
    });

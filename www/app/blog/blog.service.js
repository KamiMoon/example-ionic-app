'use strict';

angular.module('preserveusMobile')
    .factory('BlogService', function($resource, CONSTANTS) {
        return $resource(CONSTANTS.DOMAIN + '/api/blog/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

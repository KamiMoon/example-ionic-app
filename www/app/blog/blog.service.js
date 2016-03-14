'use strict';

angular.module('preserveusMobile')
    .factory('BlogService', function($resource) {
        return $resource('/api/blog/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    });

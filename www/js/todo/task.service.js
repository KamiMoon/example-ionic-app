'use strict';

angular.module('starter')
    .factory('Task', function($resource, CONSTANTS) {
        return $resource(CONSTANTS.REST_API_URL + '/tasks/:id', {
            id: '@_id'
        }, {
            'update': {
                method: 'PUT'
            }
        });
    });

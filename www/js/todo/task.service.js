'use strict';

angular.module('starter')
    .factory('Task', function($resource) {
        return $resource('/api/tasks/:id', {
            id: '@_id'
        }, {
            'update': {
                method: 'PUT'
            }
        });
    });

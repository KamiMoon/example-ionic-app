'use strict';

angular.module('preserveusMobile')
    .factory('PropertyService', function($resource, CONSTANTS) {
        return $resource(CONSTANTS.DOMAIN + '/api/properties/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT',

            },
            getIncomeReport: {
                method: 'GET',
                url: CONSTANTS.DOMAIN + '/api/properties/propertyIncomeReport/:id'
            },
            getPropertyTotalReport: {
                method: 'GET',
                url: CONSTANTS.DOMAIN + '/api/properties/propertyTotalReport'
            }
        });
    });

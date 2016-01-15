angular.module('starter')
    .factory('PropertyService', function($resource, CONSTANTS) {
        return $resource(CONSTANTS.REST_API_URL + '/properties/:id/:controller', {
            id: '@_id'
        }, {
            update: {
                method: 'PUT',

            },
            getIncomeReport: {
                method: 'GET',
                url: 'api/properties/propertyIncomeReport/:id'
            },
            getPropertyTotalReport: {
                method: 'GET',
                url: 'api/properties/propertyTotalReport'
            }
        });
    });

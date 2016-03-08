'use strict';

angular.module('preserveusMobile')
    .controller('PropertyRentCtrl', function($scope, $stateParams, PropertyService) {
        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
            //photoRows
        });


        //TODO
    });

'use strict';

angular.module('preserveusMobile')
    .controller('PropertyViewCtrl', function($scope, $stateParams, Auth, PropertyService, ValidationService, ControllerUtil) {

        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;
            //photoRows
            $scope.property.photoRows = _.chunk($scope.property.photos, 2);
        });

        //TODO
        $scope.delete = function() {
            ControllerUtil.delete(id, PropertyService, '/property');
        };

    });

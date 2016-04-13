'use strict';

angular.module('preserveusMobile')
    .controller('PropertySearchCtrl', function($scope, $ionicHistory, $state, $stateParams, PropertyService) {

        $scope.searchParams = $stateParams.searchParams;

        $scope.search = function() {

            PropertyService.query($scope.searchParams).$promise.then(function(properties) {
                $scope.properties = properties;

            });

        };

        $scope.search();

        $scope.filter = function() {
            $state.go('app.propertyFilter', { searchParams: $scope.searchParams });
        };

        $scope.map = function() {

            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });
            $state.go('app.propertyMap', { searchParams: $scope.searchParams });
        };

    });

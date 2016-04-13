'use strict';

angular.module('preserveusMobile')
    .controller('PropertyFilterCtrl', function($scope, $state, $stateParams) {

        $scope.searchParams = $stateParams.searchParams;

        $scope.search = function() {

            //TODO want to go to map too
            $state.go('app.propertyList', { searchParams: $scope.searchParams });
        };

    });

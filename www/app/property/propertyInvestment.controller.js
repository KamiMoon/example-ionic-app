'use strict';

angular.module('preserveusMobile')
    .controller('PropertyInvestmentCtrl', function($scope, $stateParams, $state, PropertyService, ValidationService, PropertyInvestmentService, Auth) {
        $scope.action = $stateParams.action;

        var id = $stateParams.id;

        if ($scope.action === 'edit' && !Auth.isAdmin()) {
            $state.go('notAuthorized');
            return;
        }

        //in all cases a property must exist before adding
        PropertyService.get({
            id: id
        }).$promise.then(function(property) {
            $scope.property = property;

            if ($scope.action === 'edit') {
                PropertyInvestmentService.calculateInitialData($scope.property);
            }
        });

        $scope.changeEquity = function() {
            PropertyInvestmentService.changeEquity($scope.property);
        };

        $scope.changeEquityPercent = function() {
            PropertyInvestmentService.changeEquityPercent($scope.property);
        };

        $scope.monthlyRevenueChange = function() {
            PropertyInvestmentService.monthlyRevenueChange($scope.property);
        };

        $scope.calculateTotalMonthlyProfits = function() {
            PropertyInvestmentService.calculateTotalMonthlyProfits($scope.property);
        };

        $scope.calculateYearBasedData = function() {
            PropertyInvestmentService.calculateYearBasedData($scope.property);
        };

        $scope.save = function() {

            if ($scope.action === 'edit') {
                PropertyService.update({
                    id: $scope.property._id
                }, $scope.property).$promise.then(function() {
                    ValidationService.success();
                    $state.go('app.propertyView', { id: id });
                }, function(err) {
                    ValidationService.error(err);
                });
            }

        };
    });

'use strict';

angular.module('preserveusMobile')
    .controller('PropertyAddEditCtrl', function ($scope, $stateParams, $state, PropertyService, ValidationService) {

        var action = $stateParams.action;
        var id = $stateParams.id;

        //features
        var createPropertyFeatureRow = function () {
            return [];
        };

        var setDefaultFeatures = function () {
            $scope.property.features = [];
        };

        $scope.featureToAddRow = createPropertyFeatureRow();

        $scope.deleteFeature = function (feature) {
            for (var i = 0; i < $scope.property.features.length; i++) {
                if ($scope.property.features[i].$$hashKey === feature.$$hashKey) {
                    $scope.property.features.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addMoreFeatures = function () {
            $scope.property.features.push($scope.featureToAddRow);

            $scope.featureToAddRow = createPropertyFeatureRow();
        };

        if (action === 'edit') {
            PropertyService.get({
                id: id
            }).$promise.then(function (property) {
                $scope.property = property;

                if (!$scope.property.features || !$scope.property.features.length) {
                    setDefaultFeatures();
                }
            });

        } else {
            //add
            $scope.property = {
                photos: []
            };

            //initialize defaults
            setDefaultFeatures();
        }

        $scope.save = function (form) {
            $scope.submitted = true;

            if (form.$valid) {

                if (action === 'edit') {
                    PropertyService.update({
                        id: $scope.property._id
                    }, $scope.property).$promise.then(function () {
                        ValidationService.success();
                        $state.go('app.propertyView', {id: id});
                    }, function (err) {
                        ValidationService.displayErrors(form, err);
                    });
                } else {
                    //add
                    PropertyService.save($scope.property).$promise.then(function (property) {
                        ValidationService.success();
                        $state.go('app.propertyView', {id: property._id});
                    }, function (err) {
                        ValidationService.displayErrors(form, err);
                    });

                }
            }

        };

    });

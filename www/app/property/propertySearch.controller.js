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

    }).controller('PropertyFilterCtrl', function($scope, $state, $stateParams) {

        $scope.searchParams = $stateParams.searchParams;

        $scope.search = function() {

            //TODO want to go to map too
            $state.go('app.propertyList', { searchParams: $scope.searchParams });
        };


    }).controller('PropertyAddEditCtrl', function($scope, $stateParams, $state, PropertyService, ValidationService) {

        var action = $stateParams.action;
        var id = $stateParams.id;

        //features
        var createPropertyFeatureRow = function() {
            return [];
        };

        var setDefaultFeatures = function() {
            $scope.property.features = [];
        };

        $scope.featureToAddRow = createPropertyFeatureRow();

        $scope.deleteFeature = function(feature) {
            for (var i = 0; i < $scope.property.features.length; i++) {
                if ($scope.property.features[i].$$hashKey === feature.$$hashKey) {
                    $scope.property.features.splice(i, 1);
                    break;
                }
            }
        };

        $scope.addMoreFeatures = function() {
            $scope.property.features.push($scope.featureToAddRow);

            $scope.featureToAddRow = createPropertyFeatureRow();
        };

        if (action === 'edit') {
            PropertyService.get({
                id: id
            }).$promise.then(function(property) {
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

        $scope.save = function(form) {
            $scope.submitted = true;

            if (form.$valid) {

                if (action === 'edit') {
                    PropertyService.update({
                        id: $scope.property._id
                    }, $scope.property).$promise.then(function() {
                        ValidationService.success();
                        $state.go('app.propertyView', { id: id });
                    }, function(err) {
                        ValidationService.displayErrors(form, err);
                    });
                } else {
                    //add
                    PropertyService.save($scope.property).$promise.then(function(property) {
                        ValidationService.success();
                        $state.go('app.propertyView', { id: property._id });
                    }, function(err) {
                        ValidationService.displayErrors(form, err);
                    });

                }
            }

        };

    })

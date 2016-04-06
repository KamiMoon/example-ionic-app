'use strict';

angular.module('preserveusMobile')
    .controller('PropertyMapCtrl', function ($scope, $state, $stateParams, PropertyService, uiGmapGoogleMapApi, $ionicPlatform, $cordovaGeolocation, $ionicHistory) {

        $scope.searchParams = $stateParams.searchParams;

        $scope.filter = function() {
            $state.go('app.propertyFilter', { searchParams: $scope.searchParams });
        };

        $scope.list = function() {
            $state.go('app.propertyList', { searchParams: $scope.searchParams });
        };

        $scope.loaded = false;

        var buildMap = function() {
            if ($scope.properties.length) {

                var firstLocation = $scope.properties[0].geoLocation;

                $scope.map = {
                    center: {
                        latitude: firstLocation.lat,
                        longitude: firstLocation.lng
                    },
                    zoom: 14
                };

                $scope.mapMarkers = $scope.properties.map(function(property) {

                    var photo = '';

                    if (property.photo) {
                        photo = 'https://res.cloudinary.com/ddovrks1z/image/upload/w_100,h_100,c_fill/' + property.photo + '.jpg';
                    }

                    return {
                        latitude: property.geoLocation.lat,
                        longitude: property.geoLocation.lng,
                        id: property._id,
                        title: property.name,
                        show: false,
                        address: property.fullAddress,
                        description: property.description,
                        photo: photo
                    };
                });

                $scope.markerClick = function(marker, eventName, model) {
                    model.show = !model.show;
                };

                // $scope.zoomToLocation = function(property) {
                //     $scope.map = {
                //         center: {
                //             latitude: property.geoLocation.lat,
                //             longitude: property.geoLocation.lng
                //         },
                //         zoom: 14
                //     };

                //     $('#mapTop')[0].scrollIntoView();
                // };

                $scope.loaded = true;

            }
        };

        $scope.search = function() {

            PropertyService.query($scope.searchParams).$promise.then(function(properties) {
                $scope.properties = properties;

                $scope.currentProperty = $scope.properties[0];
                //uiGmapGoogleMapApi.then(function(maps) {
                //buildMap();
                buildNativeMap();
                //});
            });

        };

        $scope.search();


        $scope.directions = function () {
            console.log('directions');

            if (typeof plugin !== 'undefined' && $scope.currentProperty) {

                var posOptions = {timeout: 10000, enableHighAccuracy: false};
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;

                        console.log('found my position at ' + lat + ', ' + long);

                        plugin.google.maps.external.launchNavigation({
                            "from": new plugin.google.maps.LatLng(lat, long),
                            "to": new plugin.google.maps.LatLng($scope.currentProperty.geoLocation.lat, $scope.currentProperty.geoLocation.lng)
                        });

                    }, function (err) {
                        console.error(err);
                    });


            }


        };

        function buildNativeMap() {
            $ionicPlatform.ready(function () {


                console.log('buildNativeMap');
                var div = document.getElementById("map_canvas");


                var firstProperty = $scope.properties[0].geoLocation;

                if (typeof plugin !== 'undefined') {

                    var STARTING_LOCATION = new plugin.google.maps.LatLng(firstProperty.lat, firstProperty.lng);

                    // Initialize the map view
                    var map = plugin.google.maps.Map.getMap(div, {
                        'camera': {
                            'latLng': STARTING_LOCATION,
                            'zoom': 14
                        }
                    });

                    //add markers


                    var addNativeMarker = function (property) {

                        console.log('addNativeMarker');
                        map.addMarker({
                            'position': new plugin.google.maps.LatLng(property.geoLocation.lat, property.geoLocation.lng),
                            'title': property.name,
                            'snippet': property.fullAddress
                        }, function (marker) {

                            marker.showInfoWindow();

                            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {

                                $scope.$apply(function () {
                                    $scope.currentProperty = property;
                                });
                                
                            });


                            marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function () {

                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true
                                });
                                $state.go('app.propertyView', {id: property._id});
                            });

                        });
                    }


                    map.addEventListener(plugin.google.maps.event.MAP_READY, function () {
                        console.log('map ready');

                        for (var i = 0; i < $scope.properties.length; i++) {
                            addNativeMarker($scope.properties[i]);
                        }

                    });

                }

            });
        }


    }).controller('PropertySearchCtrl', function ($scope, $ionicHistory, $state, $stateParams, PropertyService) {

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

    }).controller('PropertyViewCtrl', function($scope, $stateParams, Auth, PropertyService, ValidationService, ControllerUtil) {

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

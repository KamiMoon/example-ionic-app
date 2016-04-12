'use strict';

angular.module('preserveusMobile')
    .controller('PropertyMapCtrl', function($scope, $state, $stateParams, PropertyService, $ionicPlatform, $cordovaGeolocation, $ionicHistory) {

        $scope.searchParams = $stateParams.searchParams;

        $scope.filter = function() {
            $state.go('app.propertyFilter', { searchParams: $scope.searchParams });
        };

        $scope.list = function() {
            $state.go('app.propertyList', { searchParams: $scope.searchParams });
        };

        $scope.search = function() {

            PropertyService.query($scope.searchParams).$promise.then(function(properties) {
                $scope.properties = properties;
                $scope.currentProperty = $scope.properties[0];
                buildNativeMap();
            });

        };

        $scope.search();

        $scope.directions = function() {
            console.log('directions');

            if (typeof plugin !== 'undefined' && $scope.currentProperty) {

                var posOptions = { timeout: 10000, enableHighAccuracy: false };
                $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function(position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;

                        console.log('found my position at ' + lat + ', ' + long);

                        plugin.google.maps.external.launchNavigation({
                            "from": new plugin.google.maps.LatLng(lat, long),
                            "to": new plugin.google.maps.LatLng($scope.currentProperty.geoLocation.lat, $scope.currentProperty.geoLocation.lng)
                        });

                    }, function(err) {
                        console.error(err);
                    });
            }

        };

        function buildNativeMap() {
            $ionicPlatform.ready(function() {

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
                    var addNativeMarker = function(property) {

                        console.log('addNativeMarker');
                        map.addMarker({
                            'position': new plugin.google.maps.LatLng(property.geoLocation.lat, property.geoLocation.lng),
                            'title': property.name,
                            'snippet': property.fullAddress
                        }, function(marker) {

                            marker.showInfoWindow();

                            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {

                                $scope.$apply(function() {
                                    $scope.currentProperty = property;
                                });

                            });


                            marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {

                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true
                                });
                                $state.go('app.propertyView', { id: property._id });
                            });

                        });
                    }


                    map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
                        console.log('map ready');

                        for (var i = 0; i < $scope.properties.length; i++) {
                            addNativeMarker($scope.properties[i]);
                        }

                    });

                }

            });
        }
    });

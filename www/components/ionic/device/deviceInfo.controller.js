//http://thejackalofjavascript.com/getting-started-with-ngcordova/

angular.module('preserveusMobile').controller('DeviceCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
    $ionicPlatform.ready(function() {
        safeApply($scope, function() {
            // sometimes binding does not work! :/

            // getting device infor from $cordovaDevice

            var device = $cordovaDevice.getDevice();
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;

        });
    });
});

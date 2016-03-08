'use strict';

angular.module('preserveusMobile')
    .controller('CameraCtrl', function($scope, Camera) {

        // function takePicture() {
        //     navigator.camera.getPicture(function(imageURI) {

        //         // imageURI is the URL of the image that we can use for
        //         // an <img> element or backgroundImage.

        //     }, function(err) {

        //         // Ruh-roh, something bad happened

        //     }, cameraOptions);
        // }

        // 

        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                console.log(imageURI);
                $scope.lastPhoto = imageURI;
            }, function(err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };

    });

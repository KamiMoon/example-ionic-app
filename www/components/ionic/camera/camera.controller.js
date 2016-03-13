//http://thejackalofjavascript.com/getting-started-with-ngcordova/


angular.module('preserveusMobile').controller('CameraCtrl', function($ionicPlatform, $scope, $q, $cordovaCamera, $cordovaImagePicker, UploadService) {
    $ionicPlatform.ready(function() {

        console.log('code 10');

        var options = {
            quality: 70,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 200,
            targetHeight: 200,
            encodingType: Camera.EncodingType.PNG,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            allowEdit: false,
            popoverOptions: CameraPopoverOptions

        };

        $scope.takePicture = function() {
            safeApply($scope, function() {
                $cordovaCamera.getPicture(options).then(function(fileURL) {
                    console.log('success handler');
                    console.log(fileURL);
                    //show the file image
                    $scope.imgSrc = fileURL;

                    UploadService.upload(fileURL).then(function(response) {
                        //show the server image
                        $scope.imgSrc = response.serverImageUrl;

                        //cleanup file
                        $cordovaCamera.cleanup().then(function() {
                            console.log('cleaned up file');
                        });
                    });

                }, function(resp) {

                    console.log('error handler');
                    console.log('Error status: ' + resp.status);
                });
            });
        };


        $scope.images = [];

        var pickerOptions = {
            maximumImagesCount: 10,
            width: 800,
            height: 800,
            quality: 80
        };

        var doUpload = function(fileURL) {

            var promise = UploadService.upload(fileURL).then(function(response) {
                //show the server image
                $scope.images.push(response.serverImageUrl);
            });
            return promise;
        };

        $scope.pickPictures = function() {

            $cordovaImagePicker.getPictures(pickerOptions)
                .then(function(results) {

                    var promises = [];

                    for (var i = 0; i < results.length; i++) {
                        promises.push(doUpload(results[i]));
                    }

                    $q.all(promises).then(function() {
                        //cleanup file
                        $cordovaCamera.cleanup().then(function() {
                            console.log('cleaned up file');
                        });
                    });

                }, function(error) {
                    console.error(error);
                });
        };


    });
});

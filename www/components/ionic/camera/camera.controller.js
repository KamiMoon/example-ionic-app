//http://thejackalofjavascript.com/getting-started-with-ngcordova/


angular.module('preserveusMobile').controller('CameraCtrl', function($ionicPlatform, $scope, $cordovaCamera, UploadService) {
    $ionicPlatform.ready(function() {

        console.log('code 9');

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
    });
});

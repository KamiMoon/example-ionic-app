//http://thejackalofjavascript.com/getting-started-with-ngcordova/


angular.module('preserveusMobile').controller('CameraCtrl', function($ionicPlatform, $scope, $cordovaCamera, $cordovaFileTransfer) {
    $ionicPlatform.ready(function() {

        console.log('code 9');

        var options = {
            quality: 50,
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

                    var server = "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload";
                    var options = {
                        fileKey: "file",
                        fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
                        mimeType: "image/png",
                        params: {
                            upload_preset: "saogp2ap"
                        }
                    };

                    $cordovaFileTransfer.upload(server, fileURL, options)
                        .then(function(result) {
                            var response = JSON.parse(result.response);
                            var public_id = response.public_id;
                            var serverImageUrl = 'https://res.cloudinary.com/ddovrks1z/image/upload/';
                            serverImageUrl += public_id + '.' + response.format;

                            //show the server image
                            $scope.imgSrc = serverImageUrl;

                            //cleanup file
                            $cordovaCamera.cleanup().then(function() {
                                console.log('cleaned up file');
                            });

                        }, function(error) {
                            console.error("upload error source " + error.source);
                            console.error("upload error target " + error.target);
                        }, function(progress) {
                            // constant progress updates

                            /*

                            $timeout(function () {
                                  $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                });

                                */
                        });


                }, function(resp) {

                    console.log('error handler');
                    console.log('Error status: ' + resp.status);
                });
            });
        };
    });
});

'use strict';

angular.module('preserveusMobile')
    .directive('bUpload', function($rootScope, $timeout, Upload) {
        return {
            templateUrl: 'components/bInput/bUpload.directive.html',
            scope: {
                ngModel: '=',
                transformation: '@'
            },
            restrict: 'E',
            link: function(scope, element, attrs) {

                scope.uploadFile = function(file, errFiles) {
                    scope.f = file;
                    scope.errFile = errFiles && errFiles[0];
                    if (file) {
                        file.upload = Upload.upload({
                            skipAuthorization: true,
                            url: "https://api.cloudinary.com/v1_1/" + "ddovrks1z" + "/upload",
                            fields: {
                                upload_preset: 'saogp2ap' //,
                                    //tags: 'myphotoalbum',
                                    //context: 'photo=' + scope.title
                            },

                            file: file
                        });

                        file.upload.then(function(response) {
                            $timeout(function() {
                                file.result = response.data;

                                var public_id = file.result.public_id;

                                var url = 'https://res.cloudinary.com/ddovrks1z/image/upload/';

                                if (scope.transformation) {
                                    url += scope.transformation + '/';
                                }

                                url += public_id + '.' + file.result.format;

                                scope.resultUrl = url;
                                //set on the user API
                                scope.ngModel = public_id;

                            });
                        }, function(response) {
                            if (response.status > 0) {
                                scope.errorMsg = response.status + ': ' + response.data;
                            }
                        }, function(evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));
                        });
                    }
                };

                scope.remove = function() {
                    scope.f = null;
                    scope.errFile = null;
                    scope.errorMsg = null;
                    scope.ngModel = null;
                    scope.resultUrl = null;
                };

            }
        };
    }).directive('bUploadMultiple', function($ionicPlatform, $ionicLoading, $q, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, UploadService) {
        return {
            templateUrl: 'components/bInput/bUploadMultiple.directive.html',
            scope: {
                ngModel: '=',
                transformation: '@'
            },
            restrict: 'E',
            link: function(scope, element, attrs) {

                var unwatch = scope.$watch('ngModel', function(ngModel) {
                    if (ngModel) {
                        //initialize
                        if (scope.ngModel && scope.ngModel.length > 0 && !scope.images) {
                            scope.images = angular.copy(scope.ngModel).map(function(public_id) {
                                return {
                                    public_id: public_id
                                };
                            });
                        }

                        unwatch(); //Remove the watch

                    }
                });

                scope.remove = function(index) {
                    scope.images.splice(index, 1);

                    if (scope.ngModel) {
                        scope.ngModel.splice(index, 1);
                    }

                };

                $ionicPlatform.ready(function() {

                    console.log('code 10');

                    var quality = 95;
                    var width = 500;
                    var height = 500;

                    var options = {
                        quality: quality,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        destinationType: Camera.DestinationType.FILE_URI,
                        targetWidth: width,
                        targetHeight: height,
                        encodingType: Camera.EncodingType.PNG,
                        saveToPhotoAlbum: false,
                        correctOrientation: true,
                        allowEdit: false,
                        popoverOptions: CameraPopoverOptions

                    };


                    var doUpload = function(fileURL) {

                        var image = {
                            progress: 0
                        };

                        scope.images.unshift(image);

                        //var index = scope.images.length;

                        var promise = UploadService.upload(fileURL).then(function(response) {
                            //show the server image
                            //scope.images.push(response.public_id);

                            if (scope.ngModel) {
                                scope.ngModel.unshift(response.public_id);
                            }
                        }, function(error) {
                            console.error(error);
                        }, function(evt) {

                            var progress = Math.min(100, parseInt(100.0 *
                                evt.loaded / evt.total));

                            console.log(progress);

                            image.progress = progress;
                        });
                        return promise;
                    };

                    scope.takePicture = function() {
                        safeApply(scope, function() {
                            $cordovaCamera.getPicture(options).then(function(fileURL) {
                                console.log('success handler');
                                console.log(fileURL);

                                doUpload(fileURL).then(function() {
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

                    var pickerOptions = {
                        maximumImagesCount: 10,
                        width: width,
                        height: height,
                        quality: quality
                    };

                    scope.pickPictures = function() {

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


                    var buttonLabels = ['Take Photo', 'Choose Existing'];
                    var sheetOptions = {
                        //title: 'What do you want with this image?',
                        buttonLabels: buttonLabels,
                        addCancelButtonWithLabel: 'Cancel',
                        androidEnableCancelButton: true,
                        winphoneEnableCancelButton: true,
                        //addDestructiveButtonWithLabel: 'Delete it'
                    };

                    scope.actionSheet = function() {
                        $cordovaActionSheet.show(sheetOptions)
                            .then(function(btnIndex) {
                                console.log(btnIndex);

                                //1-based index
                                var index = btnIndex - 1;
                                console.log(buttonLabels[index]);

                                switch (index) {
                                    case 0:
                                        scope.takePicture();
                                        break;
                                    case 1:
                                        scope.pickPictures();
                                        break;
                                }
                            });

                    };


                });
            }
        };
    });

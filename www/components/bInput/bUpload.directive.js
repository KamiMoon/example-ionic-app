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
    }).directive('bUploadMultiple', function($ionicPlatform, $q, $cordovaCamera, $cordovaImagePicker, UploadService) {
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
                            scope.images = angular.copy(scope.ngModel);
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


                    var doUpload = function(fileURL) {

                        var promise = UploadService.upload(fileURL).then(function(response) {
                            //show the server image
                            scope.images.push(response.public_id);

                            if (scope.ngModel) {
                                scope.ngModel.push(response.public_id);
                            }
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
                        width: 800,
                        height: 800,
                        quality: 80
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


                });
            }
        };
    });

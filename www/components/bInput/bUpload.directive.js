'use strict';

angular.module('preserveusMobile')
    .directive('bUpload', function($ionicPlatform, $ionicLoading, $q, $cordovaCamera, $cordovaImagePicker, $cordovaActionSheet, UploadService) {
        return {
            templateUrl: 'components/bInput/bUploadMultiple.directive.html',
            scope: {
                ngModel: '=',
                transformation: '@',
                multiple: '@'
            },
            restrict: 'E',
            link: function(scope, element, attrs) {
                var multiple = !!scope.multiple;

                //scope.multiple = multiple;
                var unwatch = scope.$watch('ngModel', function(ngModel) {
                    if (ngModel) {

                        if (multiple) {
                            //initialize
                            if (scope.ngModel && scope.ngModel.length > 0 && !scope.images) {
                                scope.images = angular.copy(scope.ngModel).map(function(public_id) {
                                    return {
                                        public_id: public_id
                                    };
                                });
                            }

                            unwatch(); //Remove the watch
                        } else {
                            unwatch(); //Remove the watch
                        }

                    }
                });

                var remove = function(index) {

                    if (multiple) {
                        scope.images.splice(index, 1);

                        if (scope.ngModel) {
                            scope.ngModel.splice(index, 1);
                        }
                    } else {
                        scope.image = null;
                        scope.ngModel = null;
                    }

                };

                $ionicPlatform.ready(function() {
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

                        if (multiple) {
                            scope.images.unshift(image);
                        } else {
                            scope.image = image;
                        }

                        //var index = scope.images.length;

                        var promise = UploadService.upload(fileURL).then(function(response) {
                            //show the server image
                            if (multiple) {
                                scope.ngModel.unshift(response.public_id);
                            } else {

                                scope.ngModel = response.public_id;

                                console.log(scope.ngModel);
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
                        maximumImagesCount: 1,
                        width: width,
                        height: height,
                        quality: quality
                    };

                    if (multiple) {
                        pickerOptions.maximumImagesCount = 10;
                    }

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
                        console.log('actionSheet');

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

                    scope.removeMenu = function(index) {

                        console.log('Should remove:' + index);

                        $cordovaActionSheet.show({
                                addDestructiveButtonWithLabel: 'Delete',
                                addCancelButtonWithLabel: 'Cancel',
                                androidEnableCancelButton: true,
                                winphoneEnableCancelButton: true,
                            })
                            .then(function(btnIndex) {

                                if (btnIndex === 1) {
                                    //delete button
                                    remove(index);
                                }

                            });
                    };

                });
            }
        };
    });

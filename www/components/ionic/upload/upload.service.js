'use strict';

angular.module('preserveusMobile')
    .service('UploadService', function($q, $cordovaFileTransfer, CONSTANTS) {

        this.upload = function(fileURL) {
            var deferred = $q.defer();

            var options = {
                fileKey: "file",
                fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
                //mimeType: "image/png",
                params: {
                    upload_preset: "saogp2ap"
                }
            };

            $cordovaFileTransfer.upload(CONSTANTS.CLOUDINARY_UPLOAD_URL, fileURL, options)
                .then(function(result) {
                    var response = JSON.parse(result.response);
                    var public_id = response.public_id;
                    var serverImageUrl = CONSTANTS.CLOUDINARY_IMAGE_URL;
                    serverImageUrl += public_id + '.' + response.format;
                    response.serverImageUrl = serverImageUrl;

                    deferred.resolve(response);

                }, function(error) {
                    console.error("upload error source " + error.source);
                    console.error("upload error target " + error.target);

                    deferred.reject(error);

                }, function(progress) {
                    // constant progress updates

                    /*

                    $timeout(function () {
                          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                        });

                        */
                    deferred.notify(progress);
                });

            return deferred.promise;
        };

    });

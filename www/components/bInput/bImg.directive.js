'use strict';

angular.module('preserveusMobile')
    .directive('bImg', function(CONSTANTS) {
        return {
            //transclude: true,
            scope: {
                transformation: '@',
                format: '@'
            },
            replace: true,
            template: '<img ng-src="{{url}}">',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                var url = CONSTANTS.CLOUDINARY_IMAGE_URL;

                var oldValue = null;

                var unregister = attrs.$observe('publicId', function(value) {

                    if (value && value !== oldValue) {
                        oldValue = value;

                        scope.format = scope.format || 'jpg';

                        if (scope.transformation) {
                            url += scope.transformation + '/';
                        }

                        scope.url = url + value + '.' + scope.format;

                    }

                });


            }
        };
    });

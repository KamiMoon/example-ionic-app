//https://forum.ionicframework.com/t/external-links-facebook-twitter-to-load-outside-of-app/977/4
//<button browse-to="https://www.google.com">Open Google</button>
angular.module('preserveusMobile').directive('browseTo', function($ionicGesture) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            var handleTap = function() {
                // todo: capture Google Analytics here
                window.open(encodeURI($attrs.browseTo), '_system');
            };
            var tapGesture = $ionicGesture.on('tap', handleTap, $element);
            $scope.$on('$destroy', function() {
                // Clean up - unbind drag gesture handler
                $ionicGesture.off(tapGesture, 'tap', handleTap);
            });
        }
    };
});

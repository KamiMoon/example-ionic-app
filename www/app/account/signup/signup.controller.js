'use strict';

angular.module('preserveusMobile')
    .controller('SignupCtrl', function($scope, Auth, $location, ValidationService) {
        $scope.user = {};

        $scope.register = function(form) {
            $scope.submitted = true;

            if (form.$valid) {

                if ($scope.user.password !== $scope.user.confirmPassword) {
                    ValidationService.error('Passwords do not match.');
                    return;
                }

                Auth.createUser($scope.user)
                    .then(function() {
                        ValidationService.success('You have been registered. Check your email to verify.');
                        // Account created, redirect to home
                        $location.path('/thanks');
                    }, function(err) {
                        ValidationService.displayErrors(form, err);
                    });
            }
        };

        //$scope.loginOauth = function(provider) {
        //    $window.location.href = '/auth/' + provider;
        //};
    });

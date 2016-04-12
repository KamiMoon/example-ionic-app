'use strict';

angular.module('preserveusMobile')
    .controller('UserListCtrl', function($scope, $state, User, ValidationService) {

        $scope.users = User.query();

        $scope.searchParams = {};

        $scope.search = function() {
            $scope.users = User.query($scope.searchParams);
        };
        /*
        $scope.delete = function(index, id) {

            var r = confirm('Are you sure you want to delete?');
            if (r == true) {
                User.delete({
                    id: id
                }).$promise.then(function() {
                    ValidationService.success();
                    $scope.users.splice(index, 1);
                }, function() {
                    ValidationService.error('Delete Failed');
                });
            }

        };
        */
    });

'use strict';

angular.module('preserveusMobile')
    .controller('UserCtrl', function($scope, $state, User, ValidationService) {

        $scope.users = User.query();

        $scope.searchParams = {};

        $scope.search = function() {

            $scope.users = User.query($scope.searchParams);

        };
        /*

        $scope.view = function(id) {
            $state.go('app.userView', { id: id });
        };

        $scope.edit = function(id) {
            $state.go('app.userEdit', { id: id });
        };

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
    }).controller('UserEditCtrl', function($scope, $state, $stateParams, User, ControllerUtil) {
        var id = $stateParams.id;

        $scope.user = User.profile({
            id: id
        });

        $scope.save = function(form) {

            if (ControllerUtil.validate($scope, form)) {

                var request = User.update({
                    id: id
                }, $scope.user).$promise;

                ControllerUtil.handle(request, form).then(function() {
                    $state.go('app.userView', { id: id });
                });
            }

        };

    }).controller('UserProfileCtrl', function($scope, $stateParams, User, ValidationService) {
        var id = $stateParams.id;

        if (!id) {
            User.get().$promise.then(function(user) {
                $scope.user = user;
                showMessageToFillOutProfile(user);
            });
        } else {
            User.profile({
                id: id
            }).$promise.then(function(user) {
                $scope.user = user;
                showMessageToFillOutProfile(user);
            });
        }

        var showMessageToFillOutProfile = function(user) {
            if (!user.name) {
                ValidationService.info("Your profile has not been filled out.  Click 'Edit' to complete your profile.");
            }
        };



    });

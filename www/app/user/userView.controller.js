'use strict';

angular.module('preserveusMobile')
    .controller('UserViewCtrl', function($scope, $stateParams, User, Chats, $state, Auth, ValidationService) {
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

        $scope.createChat = function() {
            Chats.create([Auth.getCurrentUser()._id, id]).then(function(response) {
                $state.go('app.chat-detail', { chatId: response.data._id });
            });
        };

    });

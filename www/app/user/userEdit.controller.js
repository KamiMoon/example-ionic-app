'use strict';

angular.module('preserveusMobile')
    .controller('UserEditCtrl', function($scope, $state, $stateParams, User, ControllerUtil) {
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

    })

angular.module('preserveusMobile')

    .controller('DebugCtrl', function ($scope, DebugService) {

        $scope.$on('$ionicView.enter', function () {
            $scope.debugStatements = DebugService.getDebugStatements();
        });

        $scope.clear = function () {
            DebugService.clear();

            $scope.debugStatements = DebugService.getDebugStatements();
        };
    });

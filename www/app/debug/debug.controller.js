angular.module('preserveusMobile')

    .controller('DebugCtrl', function ($scope, DebugService) {

        var doRefresh = function () {
            $scope.debugStatements = DebugService.getDebugStatements();
        };
        
        $scope.doRefresh = function () {
            doRefresh();
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.$on('$ionicView.enter', function () {
            doRefresh();
        });

        $scope.clear = function () {
            DebugService.clear();
            doRefresh();
        };
    });

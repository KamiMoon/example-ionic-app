angular.module('preserveusMobile')
    .controller('ChatsCtrl', function($scope, Chats, Auth) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        $scope.$on('$ionicView.enter', function() {

            Chats.forUser(Auth.getCurrentUser()._id).then(function(chats) {
                console.log(chats);
                $scope.chats = chats;

                //TODO set photo
            });


            $scope.remove = function(chat) {

                Chats.markChatDeletedForUser(chat._id, Auth.getCurrentUser()._id);

                $scope.chats.splice($scope.chats.indexOf(chat), 1);
            };

        });


    })



.controller('ChatTestCtrl', function($scope, $http, SocketService, CONSTANTS) {
    $scope.awesomeThings = [];

    $http.get(CONSTANTS.DOMAIN + '/api/things').success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        SocketService.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
        if ($scope.newThing === '') {
            return;
        }
        $http.post(CONSTANTS.DOMAIN + '/api/things', { name: $scope.newThing });
        $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
        $http.delete(CONSTANTS.DOMAIN + '/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function() {
        SocketService.unsyncUpdates('thing');
    });
});

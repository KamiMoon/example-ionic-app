angular.module('preserveusMobile')
    .controller('ChatsCtrl', function($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };

        //});


    })

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

    $scope.chatDetail = Chats.getChatDetail($stateParams.chatId);

    $scope.messageText = '';

    var name = 'Eric Kizaki';

    $scope.sendMessage = function() {
        console.log('hi');

        if ($scope.messageText.length > 0) {

            $scope.chatDetail.messages.push({
                name: name,
                time: new Date().getTime(),
                text: $scope.messageText
            });

            $scope.messageText = '';
        }
    };
})

.controller('ChatTestCtrl', function($scope, $http, socket, CONSTANTS) {
    $scope.awesomeThings = [];

    $http.get(CONSTANTS.DOMAIN + '/api/things').success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;
        socket.syncUpdates('thing', $scope.awesomeThings);
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
        socket.unsyncUpdates('thing');
    });
});

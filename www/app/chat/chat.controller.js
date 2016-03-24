angular.module('preserveusMobile')
    .controller('ChatsCtrl', function($scope, Chats, Auth) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        $scope.$on('$ionicView.enter', function(e) {

            var myUserId = Auth.getCurrentUser()._id;

            if (!myUserId) {
                //TODO redirect to login
                console.log('I am not logged in - cant');
            }

            Chats.forUser(myUserId).then(function(chats) {
                console.log(chats);
                $scope.chats = chats;
            });

            $scope.remove = function(chat) {
                Chats.remove(chat);
            };

        });


    })

.controller('ChatDetailCtrl', function($scope, $stateParams, Auth, Chats) {
    var currentUser = Auth.getCurrentUser();

    $scope.chat = Chats.get($stateParams.chatId);

    Chats.getDetail($stateParams.chatId).then(function(chat) {
        $scope.chatDetail = chat;
        //socket.syncUpdates('chatDetail', $scope.chatDetail.messages);
    });

    $scope.messageText = '';

    $scope.name = 'Eric Kizaki';

    $scope.sendMessage = function() {
        console.log('hi');

        if ($scope.messageText.length > 0) {

            var newMessage = {
                user_id: currentUser._id,
                text: $scope.messageText
            };

            Chats.sendMessage($scope.chatDetail._id, newMessage).then(
                function(response) {
                    console.log(response.data);

                    $scope.chatDetail.messages.push(newMessage);
                    $scope.messageText = '';
                },
                function() {
                    //TODO
                });
        }
    };

})

.controller('ChatCreateCtrl', function($scope, $stateParams, Auth, Chats) {

    var otherUser = $stateParams.user_id;
    var myUserId = Auth.getCurrentUser()._id;

    if (!myUserId) {
        //TODO redirect to login
        console.log('I am not logged in - cant');
    }

    Chats.create([myUserId, otherUser]).then(function(response) {
        console.log(response.data);
    });

    /*
    $scope.chat = Chats.get($stateParams.chatId);

    $scope.chatDetail = Chats.getChatDetail($stateParams.chatId);

    $scope.messageText = '';

    $scope.name = 'Eric Kizaki';

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
    */
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

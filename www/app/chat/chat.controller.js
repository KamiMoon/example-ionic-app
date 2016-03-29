angular.module('preserveusMobile')
    .controller('ChatsCtrl', function($scope, Chats, Auth) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        $scope.$on('$ionicView.enter', function(e) {

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

.controller('ChatDetailCtrl', function($scope, $stateParams, Auth, Chats, SocketService, $timeout) {
    var currentUser = Auth.getCurrentUser();

    var userMap = {};

    var setupMessageForRender = function(message) {

        //mark any with my user id as sent
        if (message.user_id === currentUser._id) {
            message.sent = true;
        }

        var messageUser = userMap[message.user_id];
        if (messageUser) {
            //copy over the user photo and name
            message.photo = messageUser.photo;
            message.name = messageUser.name;
        }
    };

    //$scope.chat = Chats.get($stateParams.chatId);

    var onSaveEvent = function(item) {
        console.log('reveived event');

        if (item) {
            if (item.chatId === $scope.chatDetail._id) {
                console.log('message is for this chat');
                //console.log(item);

                setupMessageForRender(item.messageObj);
                console.log(item.messageObj);

                $scope.chatDetail.messages.push(item.messageObj);
            }
        }
    };


    Chats.getDetail($stateParams.chatId).then(function(chat) {

        for (var j = 0; j < chat.users.length; j++) {
            var user = chat.users[j];
            userMap[user.user_id] = user;
        }

        for (var i = 0; i < chat.messages.length; i++) {
            setupMessageForRender(chat.messages[i]);
        }

        $scope.chatDetail = chat;

        //scroll to bottom of the chat
        $timeout(function() {
            $timeout(function() {
                $('chat-message').last();
                //TODO - scroll into view
            });
        });

        //socket.syncUpdates('chatDetail', $scope.chatDetail.messages);

        //todo - not here - forward
        SocketService.getSocket().then(function(socket) {
            socket.on('chatDetail:save', function(item) {
                onSaveEvent(item);
            });
        });
    });


    $scope.messageText = ''; //'<img public-id="preserveus/spqex9kfea7thuploy6j" transformation="w_40,h_40,c_thumb,g_face" alt="Pic" class="img-thumbnail" ng-src="http://res.cloudinary.com/ddovrks1z/image/upload/w_40,h_40,c_thumb,g_face/preserveus/spqex9kfea7thuploy6j.jpg" src="http://res.cloudinary.com/ddovrks1z/image/upload/w_40,h_40,c_thumb,g_face/preserveus/spqex9kfea7thuploy6j.jpg">';

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

                    $scope.messageText = '';
                },
                function() {
                    //TODO
                });
        }
    };

})

// .controller('ChatCreateCtrl', function($scope, $state, $stateParams, Auth, Chats) {

//     var otherUser = $stateParams.user_id;

//     Chats.create([Auth.getCurrentUser()._id, otherUser]).then(function(response) {
//         console.log(response.data);

//         $state.go('app.chat-detail', { chatId: response.data._id });
//     });
// })

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

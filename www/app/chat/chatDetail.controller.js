/**
 * Created by erickizaki on 3/29/16.
 */
angular.module('preserveusMobile').controller('ChatDetailCtrl', function($scope, $stateParams, Auth, Chats, $timeout, $ionicScrollDelegate, SocketService) {
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

    var onSaveEvent = function(item) {
        console.log('reveived event');

        if (item && $scope.chatDetail) {
            if (item.chatId === $scope.chatDetail._id) {
                console.log('message is for this chat');

                setupMessageForRender(item.messageObj);
                console.log(item.messageObj);

                $scope.chatDetail.messages.push(item.messageObj);

                $ionicScrollDelegate.scrollBottom(true);
            }
        }
    };

    $scope.$on('chatDetail:save', function(ev, data) {
        safeApply($scope, function() {
            onSaveEvent(data);
        });
    });

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
                $ionicScrollDelegate.scrollBottom(true);
            });
        });
    });


    $scope.messageText = '';
    $scope.name = 'Eric Kizaki';

    $scope.sendMessage = function() {

        if ($scope.messageText.length > 0) {

            var newMessage = {
                user_id: currentUser._id,
                text: $scope.messageText
            };

            //close keyboard

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }

            Chats.sendMessage($scope.chatDetail._id, newMessage).then(
                function(response) {
                    $scope.messageText = '';

                    $ionicScrollDelegate.scrollBottom(true);

                    //console.log(response);
                    //emit
                    SocketService.getSocket().emit('chatDetail:save', response.data);

                },
                function() {
                    //TODO
                });
        }
    };

});

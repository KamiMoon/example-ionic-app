angular.module('preserveusMobile')
    .controller('ChatsCtrl', function($rootScope, $scope, Chats, Auth) {

        //reset messageCount
        $rootScope.newMessageCount = 0;

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

        var onSaveEvent = function (item) {
            if (item && $scope.chats) {

                for (var i = 0; i < $scope.chats.length; i++) {
                    var chat = $scope.chats[i];

                    if (item.chatId === chat._id) {
                        if(!chat.newMessageCount){
                            chat.newMessageCount = 0;
                        }
                        chat.newMessageCount++;
                        chat.lastMessage = item.messageObj.text;
                    }
                }
            }
        };

        $scope.$on('chatDetail:save', function (ev, data) {
            onSaveEvent(data);
        });




    });

angular.module('preserveusMobile')

.factory('Chats', function($http, $q, CONSTANTS) {

    return {

        create: function(userIds) {
            var chat = {
                users: userIds.map(function(userId) {
                    return {
                        user_id: userId
                    };
                }),
                messages: []
            };

            return $http.post(CONSTANTS.DOMAIN + '/api/chats/create', chat);
        },
        forUser: function(userId) {
            var deferred = $q.defer();

            $http.get(CONSTANTS.DOMAIN + '/api/chats/foruser/' + userId).then(
                function(response) {
                    var chats = response.data;
                    var filteredChat = chats.map(function(chat) {
                        var chatObj = {
                            _id: chat._id,
                            lastMessage: chat.lastMessage,
                            users: chat.users.filter(function(user) {
                                return user.user_id !== userId;
                            })
                        };

                        return chatObj;
                    });

                    deferred.resolve(filteredChat);
                },
                function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },
        getDetail: function(id) {
            var deferred = $q.defer();

            $http.get(CONSTANTS.DOMAIN + '/api/chats/detail/' + id).then(
                function(response) {
                    deferred.resolve(response.data);
                },
                function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        },
        sendMessage: function(chatId, messageObj) {

            var payload = {
                chatId: chatId,
                messageObj: messageObj
            };

            return $http.post(CONSTANTS.DOMAIN + '/api/chats/sendMessage', payload);
        },
        markChatDeletedForUser: function(chatId, userId) {

            var deferred = $q.defer();

            $http.put(CONSTANTS.DOMAIN + '/api/chats/markChatDeletedForUser/' + chatId + '/' + userId, {}).then(
                function(response) {
                    deferred.resolve(response.data);
                },
                function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    };
});

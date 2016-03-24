angular.module('preserveusMobile')

.factory('Chats', function($http, $q, CONSTANTS) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        _id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        _id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        _id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        _id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        _id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    var chatDetails = [{
        chat_id: 0,
        messages: [{
            name: 'Ben Sparrow',
            face: 'img/ben.png',
            text: 'hi',
            time: 1458354319,
            sent: false
        }, {
            name: 'Ben Sparrow',
            face: 'img/ben.png',
            text: 'sup',
            time: 1458354333,
            sent: false

        }, {
            name: 'Eric Kizaki',
            face: 'img/mike.png',
            text: 'what?',
            time: 1458354333,
            sent: true

        }, {
            name: 'Ben Sparrow',
            face: 'img/ben.png',
            text: 'asdf af saf af af af sdf fdsf df  f fffffff  asdffff asd fs df  ff sdf ds dfs sdf fa  asfas dsfsf sf fa safsafss',
            time: 1458354333,
            sent: false

        }, {
            name: 'Eric Kizaki',
            face: 'img/mike.png',
            text: 'asdfasfs fafs df sadfsd f sfs fsd dssf as fas fsa f safds fas fds fas f s sfs df asdf asf sd fs f sfas fs',
            time: 1458354333,
            sent: true

        }]
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i]._id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        },
        getChatDetail: function(chatId) {
            for (var i = 0; i < chatDetails.length; i++) {
                if (chatDetails[i].chat_id === parseInt(chatId)) {
                    console.log(chatDetails[i]);
                    return chatDetails[i];
                }
            }
            return null;
        },
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
                    var chat = response.data;

                    console.log(chat);

                    deferred.resolve(chat);
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
        }
    };
});

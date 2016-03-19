angular.module('preserveusMobile')

.factory('Chats', function() {
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
            text: 'hi',
            time: 1458354319,
        }, {
            name: 'Ben Sparrow',
            text: 'sup',
            time: 1458354333

        }, {
            name: 'Eric Kizaki',
            text: 'what?',
            time: 1458354333

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
        }
    };
});

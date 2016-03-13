'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.chats', {
                url: '/chats',
                views: {
                    'menuContent': {
                        templateUrl: 'app/chat/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('app.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'menuContent': {
                        templateUrl: 'app/chat/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            });
    });

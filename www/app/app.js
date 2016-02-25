// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'preserveusMobile' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'preserveusMobile.services' is found in services.js
// 'preserveusMobile.controllers' is found in controllers.js
angular.module('preserveusMobile', ['ionic', 'ngResource'])

.constant('CONSTANTS', {
    'REST_API_URL': '/api',
    //'REST_API_URL': 'http://192.168.1.3:9000/api',
    'LOCAL_TOKEN_KEY': 'preserveusMobile_token',
    'EVENTS': {
        'NOT_AUTHENTICATED': 'NOT_AUTHENTICATED',
        'NOT_AUTHORIZED': 'NOT_AUTHORIZED',
    }
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('authInterceptor');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'components/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'app/dash/tab-dash.html'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'app/chat/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'app/chat/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'app/account/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        .state('tab.todo', {
            url: '/todo',
            views: {
                'tab-todo': {
                    templateUrl: 'app/todo/tab-todo.html',
                    controller: 'TodoCtrl'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

})

.run(function($ionicPlatform, $rootScope, Auth, $timeout, $state, CONSTANTS) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            window.StatusBar.styleDefault();
        }
    });

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next, toParams, fromState, fromParams) {
        Auth.isLoggedInAsync(function(loggedIn) {
            if ((next.authenticate || next.roles) && !loggedIn) {
                event.preventDefault();

                $timeout(function() {
                    $state.go('login');
                });
            } else if (next.roles && !Auth.hasRoles(next.roles)) {
                event.preventDefault();
                $timeout(function() {
                    $state.go('/notAuthorized').replace();
                });
            }
        });
    });

    $rootScope.$on(CONSTANTS.EVENTS.NOT_AUTHENTICATED, function() {
        Auth.logout();
        $state.go('login');
    });
});

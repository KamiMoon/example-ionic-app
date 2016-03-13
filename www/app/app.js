// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'preserveusMobile' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'preserveusMobile.services' is found in services.js
// 'preserveusMobile.controllers' is found in controllers.js
angular.module('preserveusMobile', ['ionic', 'ngResource', 'ngFileUpload',
    'ngStorage', 'chart.js', 'uiGmapgoogle-maps', 'ngCordova'
])

.constant('CONSTANTS', {
    //'DOMAIN': 'https://www.preservedfw.com',
    'DOMAIN': '',
    //'REST_API_URL': '/api',
    //'REST_API_URL': 'https://www.preservedfw.com/api',
    //'REST_API_URL': 'http://192.168.1.3:9000/api',
    'LOCAL_TOKEN_KEY': 'preserveusMobile_token',
    'EVENTS': {
        'NOT_AUTHENTICATED': 'NOT_AUTHENTICATED',
        'NOT_AUTHORIZED': 'NOT_AUTHORIZED',
    },
    'CLOUDINARY_IMAGE_URL': 'http://res.cloudinary.com/ddovrks1z/image/upload/',
    'CLOUDINARY_UPLOAD_URL': 'https://api.cloudinary.com/v1_1/ddovrks1z/upload',
    'CLOUDINARY_UPLOAD_PRESET': 'saogp2ap',
    'GOOGLEMAPS_KEY': 'AIzaSyAH097-AkYDvIY7AAU42AlvFbxmUs69CRM'
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, uiGmapGoogleMapApiProvider, $compileProvider, CONSTANTS) {

    //required by camera and using ng-src
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);


    $httpProvider.interceptors.push('authInterceptor');

    uiGmapGoogleMapApiProvider.configure({
        key: CONSTANTS.GOOGLEMAPS_KEY,
        //v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    // setup an abstract state for the tabs directive

    // $stateProvider
    //     .state('tab', {
    //         url: '/tab',
    //         abstract: true,
    //         templateUrl: 'components/navbar/tabs.html'
    //     })

    // // Each tab has its own nav history stack:


    // .state('tab.chats', {
    //         url: '/chats',
    //         views: {
    //             'tab-chats': {
    //                 templateUrl: 'app/chat/tab-chats.html',
    //                 controller: 'ChatsCtrl'
    //             }
    //         }
    //     })
    //     .state('tab.chat-detail', {
    //         url: '/chats/:chatId',
    //         views: {
    //             'tab-chats': {
    //                 templateUrl: 'app/chat/chat-detail.html',
    //                 controller: 'ChatDetailCtrl'
    //             }
    //         }
    //     })
    //     .state('tab.account', {
    //         url: '/account',
    //         views: {
    //             'tab-account': {
    //                 templateUrl: 'app/account/tab-account.html',
    //                 controller: 'AccountCtrl'
    //             }
    //         }
    //     })
    //     .state('tab.todo', {
    //         url: '/todo',
    //         views: {
    //             'tab-todo': {
    //                 templateUrl: 'app/todo/tab-todo.html',
    //                 controller: 'TodoCtrl'
    //             }
    //         }
    //     })


    $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "components/navbar/slide-menu.html"
        })
        /*.state('cameraTest', {
            url: "/cameratest",
            controller: 'CameraCtrl',
            templateUrl: "components/camera/test.html"
        })
        */
        .state('device', {
            url: "/device",
            controller: 'DeviceCtrl',
            templateUrl: "components/ionic/device/deviceInfo.html"
        })
        .state('camera', {
            url: "/camera",
            controller: 'CameraCtrl',
            templateUrl: "components/ionic/camera/camera.html"
        });


    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/todo');
    $urlRouterProvider.otherwise('/camera');

})

.run(function($ionicPlatform, $rootScope, Auth, $timeout, $state, CONSTANTS) {
    $rootScope.Auth = Auth;
    $rootScope.CONSTANTS = CONSTANTS;

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
                    $state.go('notAuthorized').replace();
                });
            }
        });
    });

    $rootScope.$on(CONSTANTS.EVENTS.NOT_AUTHENTICATED, function() {
        Auth.logout();
        $state.go('login');
    });
});

/* Globals */

function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn(): scope.$apply(fn);
}

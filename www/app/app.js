// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'preserveusMobile' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'preserveusMobile.services' is found in services.js
// 'preserveusMobile.controllers' is found in controllers.js
angular.module('preserveusMobile', ['ionic', 'ngResource', 'ngFileUpload',
    'ngStorage', 'angularLoad', 'chart.js', 'uiGmapgoogle-maps', 'btford.socket-io', 'ngCordova'
])

.constant('CONSTANTS', {

    //prod
    'DOMAIN': 'https://www.preservedfw.com',
    'SOCKET_IO_URL': 'https://preserveus.herokuapp.com',

    //local
    //'DOMAIN': '',
    //'SOCKET_IO_URL': 'http://localhost:5000',

    //finch
    //'DOMAIN': 'https://clever-beef.usefinch.io/',
    //'SOCKET_IO_URL': 'https://clever-beef.usefinch.io/',


    //'REST_API_URL': '/api',
    //'REST_API_URL': 'https://www.preservedfw.com/api',
    //'REST_API_URL': 'http://192.168.1.3:9000/api',
    'LOCAL_TOKEN_KEY': 'preserveusMobile_token',
    'EVENTS': {
        'NOT_AUTHENTICATED': 'NOT_AUTHENTICATED',
        'NOT_AUTHORIZED': 'NOT_AUTHORIZED'
    },
    'CLOUDINARY_IMAGE_URL': 'http://res.cloudinary.com/ddovrks1z/image/upload/',
    'CLOUDINARY_UPLOAD_URL': 'https://api.cloudinary.com/v1_1/ddovrks1z/upload',
    'CLOUDINARY_UPLOAD_PRESET': 'saogp2ap',
    'GOOGLEMAPS_KEY': 'AIzaSyAH097-AkYDvIY7AAU42AlvFbxmUs69CRM',

    'GOOGLEMAP_KEY_ANDROID': 'AIzaSyDVDPe2Wsw-NeNWfXaKFiCnOTtUmT4pCHo',
    'GOOGLEMAP_KEY_IOS': 'AIzaSyCdQJHh6-PvhDrvL_-Y_S9xCqOpuzO1VXI'
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
        })
        .state('app.debug', {
            url: '/debug',
            views: {
                'menuContent': {
                    templateUrl: 'app/debug/debug.html',
                    controller: 'DebugCtrl'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/todo');
    //$urlRouterProvider.otherwise('/camera');
    $urlRouterProvider.otherwise('/app/property');

}).run(function ($ionicPlatform, $ionicHistory, $rootScope, Auth, $timeout, $state, CONSTANTS, SocketService) {
    $rootScope.Auth = Auth;
    $rootScope.CONSTANTS = CONSTANTS;

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            window.StatusBar.styleDefault();
        }

        //listen to app events
        SocketService.init();
    });

    $rootScope.sideMenuStyle = {
        "visibility": "visible"
    };

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

        if (next.hideSideMenu) {
            //hide the side menu
            //document.getElementById('side-menu').style.visibility = "hidden";
            //$rootScope.hideSideMenu = true;

            $rootScope.sideMenuStyle = {
                "visibility": "hidden"
            };

            $ionicHistory.nextViewOptions({
                disableAnimate: true
            });

        } else {
            //document.getElementById('side-menu').style.visibility = "visible";
            //$rootScope.hideSideMenu = false;
            $rootScope.sideMenuStyle = {
                "visibility": "visible"
            };
        }
    });


    $rootScope.$on('chatDetail:save', function(ev, data) {

        if (!$rootScope.newMessageCount) {
            $rootScope.newMessageCount = 0;
        }
        $rootScope.newMessageCount++;
    });

    $rootScope.logout = function() {
        Auth.logout();
        $state.go('login');
    };

    $rootScope.$on(CONSTANTS.EVENTS.NOT_AUTHENTICATED, function() {
        $rootScope.logout();
    });


});

/* Globals */

function safeApply(scope, fn) {
    (scope.$$phase || scope.$root.$$phase) ? fn(): scope.$apply(fn);
}

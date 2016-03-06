'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/account/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'app/account/signup/signup.html',
                controller: 'SignupCtrl'
            })
            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'app/account/settings/settings.html',
                        controller: 'SettingsCtrl',
                    }
                },
                authenticate: true
            }).state('app.changePassword', {
                url: '/changePassword',
                views: {
                    'menuContent': {
                        templateUrl: 'app/account/settings/changePassword.html',
                        controller: 'SettingsCtrl',
                    }
                },
                authenticate: true
            });
    });

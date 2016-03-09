'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.userList', {
                url: '/user',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userList.html',
                        controller: 'UserCtrl',
                    }
                },
                roles: ['admin']
            }).state('app.userEdit', {
                url: '/user/edit/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userEdit.html',
                        controller: 'UserEditCtrl',
                    }
                }
            }).state('app.userView', {
                url: '/profile/:id',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/profile.html',
                        controller: 'UserProfileCtrl'
                    }
                }
            }).state('app.userInvest', {
                url: '/userInvest/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userInvestment.html',
                        controller: 'UserProfileCtrl'
                    }
                }
            }).state('app.userRent', {
                url: '/userRent/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userRent.html',
                        controller: 'UserProfileCtrl'
                    }
                }
            });
    });

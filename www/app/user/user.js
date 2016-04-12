'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.userList', {
                url: '/user',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userList.html',
                        controller: 'UserListCtrl',
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
                        templateUrl: 'app/user/userView.html',
                        controller: 'UserViewCtrl'
                    }
                }
            }).state('app.userInvest', {
                url: '/userInvest/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userInvestment.html',
                        controller: 'UserViewCtrl'
                    }
                }
            }).state('app.userRent', {
                url: '/userRent/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'app/user/userRent.html',
                        controller: 'UserViewCtrl'
                    }
                }
            });
    });

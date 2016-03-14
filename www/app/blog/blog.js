'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider.state('app.blogList', {
            url: '/blog',
            views: {
                'menuContent': {
                    templateUrl: 'app/blog/blogList.html',
                    controller: 'BlogCtrl'
                }
            }
        }).state('app.blogAddEdit', {
            url: '/blog/:action/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/blog/blogAdd.html',
                    controller: 'BlogAddEditCtrl',
                }
            },
            roles: ['admin', 'blogger']
        }).state('app.blogView', {
            url: '/blog/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/blog/blogView.html',
                    controller: 'BlogViewCtrl'
                }
            }
        }).state('app.blogKeyword', {
            url: '/blogKeyword/:keyword',
            views: {
                'menuContent': {
                    templateUrl: 'app/blog/blogList.html',
                    controller: 'BlogCtrl'
                }
            }
        });
    });

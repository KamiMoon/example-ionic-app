'use strict';

angular.module('preserveusMobile')
    .controller('BlogViewCtrl', function($scope, $stateParams, Auth, BlogService, ValidationService, $location, ControllerUtil) {

        var id = $stateParams.id;
        $scope.contentLoaded = false;

        BlogService.get({
            id: id
        }).$promise.then(function(post) {
            $scope.post = post;
            $scope.contentLoaded = true;

            // SEOService.setSEO({
            //     title: post.title,
            //     description: post.headingQuote,
            //     author: post.user_name,
            //     image: post.photo
            // });
        });

        $scope.delete = function() {
            ControllerUtil.delete(id, BlogService, '/blog');
        };

    });

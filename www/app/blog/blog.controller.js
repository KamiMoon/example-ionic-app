'use strict';

angular.module('preserveusMobile')
    .controller('BlogCtrl', function($scope, $stateParams, BlogService) {

        var searchParams = {};

        if ($stateParams.keyword) {
            searchParams['keywords.text'] = $stateParams.keyword;
        }

        $scope.posts = BlogService.query(searchParams);
    });

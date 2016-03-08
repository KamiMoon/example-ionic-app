'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('notAuthorized', {
                url: '/notAuthorized',
                templateUrl: 'app/main/notAuthorized.html'
            }).state('paymentSuccess', {
                url: '/paymentSuccess',
                templateUrl: 'app/main/paymentSuccess.html'
            });
    });

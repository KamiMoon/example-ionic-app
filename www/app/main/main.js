'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider
            .state('notAuthorized', {
                url: '/login'
            }).state('paymentSuccess', {
                url: '/paymentSuccess',
                templateUrl: 'app/main/paymentSuccess.html'
            });
    });

'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider.state('propertyList', {
            url: '/property',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyList.html',
                    controller: 'PropertyCtrl',
                }
            },
            parent: 'tab'
        }).state('propertyAddEdit', {
            url: '/property/:action/:id',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyAdd.html',
                    controller: 'PropertyAddEditCtrl',
                }
            },
            roles: ['admin'],
            parent: 'tab'
        }).state('propertyView', {
            url: '/property/:id',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyView.html',
                    controller: 'PropertyViewCtrl',
                }
            },
            parent: 'tab'
        }).state('propertyInvestment', {
            url: '/propertyInvestment/:action/:id',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyInvestment.html',
                    controller: 'PropertyInvestmentCtrl',
                }
            },
            parent: 'tab'
        }).state('propertyRent', {
            url: '/propertyRent/:id',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyRent.html',
                    controller: 'PropertyRentCtrl',
                }
            },
            parent: 'tab'
        }).state('propertyIncomeReport', {
            url: '/propertyIncomeReport/:id',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyIncomeReport.html',
                    controller: 'PropertyIncomeReportCtrl',
                }
            },
            roles: ['admin'],
            parent: 'tab'
        }).state('propertyTotalReport', {
            url: '/propertyTotalReport',
            views: {
                'tab-property': {
                    templateUrl: 'app/property/propertyTotalReport.html',
                    controller: 'PropertyTotalReportCtrl',
                }
            },
            roles: ['admin'],
            parent: 'tab'
        });
    });

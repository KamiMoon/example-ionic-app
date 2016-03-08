'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider.state('app.propertyList', {
            url: '/property',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyList.html',
                    controller: 'PropertyCtrl',
                }
            }
        }).state('app.propertyAddEdit', {
            url: '/property/:action/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyAdd.html',
                    controller: 'PropertyAddEditCtrl',
                }
            },
            roles: ['admin']
        }).state('app.propertyView', {
            url: '/property/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyView.html',
                    controller: 'PropertyViewCtrl',
                }
            }
        }).state('app.propertyInvestment', {
            url: '/propertyInvestment/:action/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyInvestment.html',
                    controller: 'PropertyInvestmentCtrl',
                }
            }
        }).state('app.propertyRent', {
            url: '/propertyRent/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyRent.html',
                    controller: 'PropertyRentCtrl',
                }
            }
        }).state('app.propertyInvest', {
            url: '/propertyInvest/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyInvest.html',
                    controller: 'PropertyRentCtrl',
                }
            }
        }).state('app.propertyIncomeReport', {
            url: '/propertyIncomeReport/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyIncomeReport.html',
                    controller: 'PropertyIncomeReportCtrl',
                }
            },
            roles: ['admin']
        }).state('app.propertyTotalReport', {
            url: '/propertyTotalReport',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyTotalReport.html',
                    controller: 'PropertyTotalReportCtrl',
                }
            },
            roles: ['admin']
        });
    });

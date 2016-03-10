'use strict';

angular.module('preserveusMobile')
    .config(function($stateProvider) {
        $stateProvider.state('app.propertyList', {
            url: '/property',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyList.html',
                    controller: 'PropertySearchCtrl',
                }
            },
            params: {
                searchParams: {}
            }
        }).state('app.propertyMap', {
            url: '/propertyMap/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyMap.html',
                    controller: 'PropertyMapCtrl',
                }
            },
            params: {
                searchParams: {}
            }
        }).state('app.propertyFilter', {
            url: '/propertyFilter',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyFilter.html',
                    controller: 'PropertyFilterCtrl',
                }
            },
            params: {
                searchParams: {}
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
        }).state('app.propertyAddEditFeatures', {
            url: '/propertyAddEditFeatures/:action/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyAddEditFeatures.html',
                    controller: 'PropertyAddEditCtrl',
                }
            },
            roles: ['admin']
        }).state('app.propertyAddEditGallery', {
            url: '/propertyAddEditGallery/:action/:id',
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyAddEditGallery.html',
                    controller: 'PropertyAddEditCtrl',
                }
            },
            roles: ['admin']
        }).state('app.propertyView', {
            url: '/property/:id',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyView.html',
                    controller: 'PropertyViewCtrl',
                }
            }
        }).state('app.propertyInvestment', {
            url: '/propertyInvestment/:action/:id',
            cache: false,
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
        }).state('app.propertyFeatures', {
            url: '/propertyFeatures/:id',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyFeatures.html',
                    controller: 'PropertyViewCtrl',
                }
            }
        }).state('app.propertyGallery', {
            url: '/propertyGallery/:id',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/property/propertyGallery.html',
                    controller: 'PropertyViewCtrl',
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

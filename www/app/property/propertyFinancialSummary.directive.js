'use strict';

angular.module('preserveusMobile')
    .directive('propertyFinancialSummary', function() {
        return {
            templateUrl: 'app/property/propertyFinancialSummary.html',
            restrict: 'E',
            scope: false,
            link: function postLink(scope, element, attrs) {

            }
        };
    });

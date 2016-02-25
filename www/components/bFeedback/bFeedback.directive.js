'use strict';

angular.module('preserveusMobile')
    .directive('bFeedback', function() {
        return {
            scope: false,
            replace: true,
            // template: '<div ng-if="bFeedbackMessage && bFeedbackMessage.length > 0" ' +
            //     'class="alert alert-{{bFeedbackMessageClass}} alert-dismissible" role="alert">{{bFeedbackMessage}}' +
            //     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            //     '<span aria-hidden="true">&times;</span></button></div>',
            //template: '<ion-content ng-if=bFeedbackMessage && bFeedbackMessage.length > 0">{{bFeedbackMessage}}</ion-content>',
            template: '<div class="bar bar-subheader {{bFeedbackMessageClass}}" ng-if="bFeedbackMessage && bFeedbackMessage.length > 0"><h5 class="title">{{bFeedbackMessage}}</h5></div>',
            restrict: 'E' //,
                //link: function postLink(scope, element, attrs) {}
        };
    });

(function () {

    'use strict';

    angular.module('preserveusMobile')
        .controller('PropertyViewCtrl', PropertyViewCtrl);


    PropertyViewCtrl.$inject = ['$stateParams', 'PropertyService'];

    /* @ngInject */
    function PropertyViewCtrl($stateParams, PropertyService) {
        var vm = this;

        var id = $stateParams.id;

        PropertyService.get({
            id: id
        }).$promise.then(function (property) {
            vm.property = property;
            //photoRows
            vm.property.photoRows = _.chunk(vm.property.photos, 2);
        });
    }

})();

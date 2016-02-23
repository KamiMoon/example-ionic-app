'use strict';

angular.module('preserveusMobile').factory('authInterceptor', function($q, $rootScope, CONSTANTS) {
    return {
        // Add authorization token to headers
        request: function(config) {
            config.headers = config.headers || {};

            var token = window.localStorage.getItem(CONSTANTS.LOCAL_TOKEN_KEY);

            if (token && !config.skipAuthorization) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if (response.status === 401) {
                // remove any stale tokens
                window.localStorage.removeItem(CONSTANTS.LOCAL_TOKEN_KEY);

                $rootScope.$broadcast(CONSTANTS.EVENTS.NOT_AUTHENTICATED, response);

                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
});

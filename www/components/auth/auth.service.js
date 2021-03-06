'use strict';

angular.module('preserveusMobile')
    .factory('Auth', function Auth($rootScope, $http, User, $q, CONSTANTS) {
        var currentUser = {};

        if (window.localStorage.getItem(CONSTANTS.LOCAL_TOKEN_KEY)) {
            currentUser = User.get();
        }

        return {

            /**
             * Authenticate user and save token
             *
             * @param  {Object}   user     - login info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            login: function(user, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                $http.post(CONSTANTS.DOMAIN + '/auth/local', {
                    email: user.email,
                    password: user.password
                }).
                success(function(data) {
                    window.localStorage.setItem(CONSTANTS.LOCAL_TOKEN_KEY, data.token);
                    currentUser = User.get();

                    $rootScope.$broadcast(CONSTANTS.EVENTS.LOGIN);

                    deferred.resolve(data);
                    return cb();
                }).
                error(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

                return deferred.promise;
            },

            /**
             * Delete access token and user info
             *
             * @param  {Function}
             */
            logout: function() {
                window.localStorage.removeItem(CONSTANTS.LOCAL_TOKEN_KEY);

                currentUser = {};

                $rootScope.$broadcast(CONSTANTS.EVENTS.LOGOUT);
            },

            /**
             * Create a new user
             *
             * @param  {Object}   user     - user info
             * @param  {Function} callback - optional
             * @return {Promise}
             */
            createUser: function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(data) {
                        window.localStorage.setItem(CONSTANTS.LOCAL_TOKEN_KEY, data.token);
                        currentUser = User.get();
                        return cb(user);
                    },
                    function(err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            /**
             * Change password
             *
             * @param  {String}   oldPassword
             * @param  {String}   newPassword
             * @param  {Function} callback    - optional
             * @return {Promise}
             */
            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return User.changePassword({
                    id: currentUser._id
                }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            /**
             * Gets all available info on authenticated user
             *
             * @return {Object} user
             */
            getCurrentUser: function() {
                return currentUser;
            },


            /**
             * Check if a user is logged in
             *
             * @return {Boolean}
             */
            isLoggedIn: function() {
                return currentUser.hasOwnProperty('roles');
            },

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            isLoggedInAsync: function(cb) {
                if (currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } else if (currentUser.hasOwnProperty('roles')) {
                    cb(true);
                } else {
                    cb(false);
                }
            },

            /**
             * Check if a user is an admin
             *
             * @return {Boolean}
             */
            isAdmin: function() {
                if (!currentUser.roles) {
                    return false;
                }

                var pos = currentUser.roles.map(function(e) {
                    return e.role;
                }).indexOf('admin');

                return pos !== -1;
            },

            hasRole: function(role) {
                if (!currentUser.roles) {
                    return false;
                }

                var pos = currentUser.roles.map(function(e) {
                    return e.role;
                }).indexOf(role);

                return pos !== -1;
            },

            hasRoles: function(roles) {
                var hadAny = false;

                if (!currentUser.roles) {
                    return false;
                }

                for (var i = 0; i < roles.length; i++) {

                    var pos = currentUser.roles.map(function(e) {
                        return e.role;
                    }).indexOf(roles[i]);

                    if (pos !== -1) {
                        hadAny = true;
                        break;
                    }
                }

                return hadAny;
            },

            isOrgAdminFor: function(organizationId, primaryOnly) {
                if (!currentUser.roles) {
                    return false;
                }

                var hasCorrectRole = false;

                for (var i = 0; i < currentUser.roles.length; i++) {
                    var currentRole = currentUser.roles[i];

                    if (currentRole.role === 'admin') {
                        hasCorrectRole = true;
                        break;
                    }

                    if (!primaryOnly && (currentRole.role === 'Organization Admin Primary' || currentRole.role === 'Organization Admin Secondary') && currentRole.organization_id === organizationId) {
                        hasCorrectRole = true;
                        break;
                    }

                    if (primaryOnly && (currentRole.role === 'Organization Admin Primary') && currentRole.organization_id === organizationId) {
                        hasCorrectRole = true;
                        break;
                    }
                }

                return hasCorrectRole;
            },

            isMemberOf: function(organizationId) {
                if (!currentUser.roles) {
                    return false;
                }

                var hasCorrectRole = false;

                for (var i = 0; i < currentUser.roles.length; i++) {
                    var currentRole = currentUser.roles[i];

                    if ((currentRole.role === 'Organization Admin Primary' || currentRole.role === 'Organization Admin Secondary' || currentRole.role === 'Member') && currentRole.organization_id === organizationId) {
                        hasCorrectRole = true;
                        break;
                    }
                }

                return hasCorrectRole;
            },

            isOrgAdmin: function() {
                if (!currentUser.roles) {
                    return false;
                }

                var hasCorrectRole = false;

                for (var i = 0; i < currentUser.roles.length; i++) {
                    var currentRole = currentUser.roles[i];
                    if ((currentRole.role === 'Organization Admin Primary' || currentRole.role === 'Organization Admin Secondary' || currentRole.role === 'admin')) {
                        hasCorrectRole = true;
                        break;
                    }
                }

                return hasCorrectRole;
            },

            isMine: function(userId) {
                if (!currentUser || !userId) {
                    return false;
                }

                return currentUser._id === userId;
            },

            /**
             * Get auth token
             */
            getToken: function() {
                return window.localStorage.getItem(CONSTANTS.LOCAL_TOKEN_KEY);
            },

            getUser: function() {
                return User.get();
            }
        };
    });

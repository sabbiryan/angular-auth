"use strict";

angular.module("authApp")
    .factory("AuthenticationService", [
        "$q", "$http", "$timeout", "UserDataService", "LocalStorageService",
        function ($q, $http, $timeout, UserDataService, LocalStorageService) {

            var _identity = undefined,
                _authenticated = false;

            return {
                isIdentityResolved: function () {
                    var identity = LocalStorageService.getUserInfo();
                    if (identity)
                        _identity = identity;
                    return angular.isDefined(_identity);
                },

                isAuthenticated: function() {
                    return _authenticated;
                },


                authenticate: function(identity) {

                    var user = UserDataService.isValidUser(identity);

                    _identity = user;
                    _authenticated = user != null;

                    if (user) {
                        LocalStorageService.setUserInfo(user);

                    } else {
                        LocalStorageService.clearUserInfo();
                    }
                },

                identity: function(force) {

                    if (force === true) _identity = undefined;

                    if (angular.isDefined(_identity)) {
                        return _identity;
                    }

                    // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
                    //                   $http.get('/api/Login/identity', { ignoreErrors: true })
                    //                        .success(function(data) {
                    //                            _identity = data;
                    //                            _authenticated = true;
                    //                            deferred.resolve(_identity);
                    //                        })
                    //                        .error(function () {
                    //                            _identity = null;
                    //                            _authenticated = false;
                    //                            deferred.resolve(_identity);
                    //                        });


                    var self = this;
                    $timeout(function() {
                        _identity = LocalStorageService.getUserInfo();
                        self.authenticate(_identity);
                    }, 1000);
                    return _identity;
                }
            };
        }
    ])

    
    .factory("AuthorizationService", [
        "$rootScope", "$state", "AuthenticationService", "PermissionDataService",
        function ($rootScope, $state, AuthenticationService, PermissionDataService) {
            return {

                authorize: function () {

                    var ideniity = AuthenticationService.identity();


                    var permission = PermissionDataService.checkUserPermission(ideniity, $rootScope.toState);

                    return permission;
                }
            };
        }
    ]);

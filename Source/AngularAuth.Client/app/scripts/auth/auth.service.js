"use strict";

angular.module("authApp")
    .factory("AuthenticationService", [
        "$q", "$http", "$timeout", "UserDataService", "LocalStorageService",
        function($q, $http, $timeout, UserDataService, LocalStorageService) {

            var _identity = undefined,
                _authenticated = false;

            return {
                isIdentityResolved: function() {
                    _identity = LocalStorageService.getUserInfo();
                    return angular.isDefined(_identity);
                },

                isAuthenticated: function() {
                    return _authenticated;
                },


                authenticate: function(identity) {

                    var user = UserDataService.isValidUser(identity);
                    

                    if (user) {
                        _identity = user;
                        _authenticated = true;

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

                    var self = this;
                    $timeout(
                        function() {
                            _identity = LocalStorageService.getUserInfo();
                            self.authenticate(_identity);
                        },
                        1000);

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

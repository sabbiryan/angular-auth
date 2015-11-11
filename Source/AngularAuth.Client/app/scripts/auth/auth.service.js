"use strict";

angular.module("authApp")
    .factory("AuthenticationService", [
        "$q", "$http", "$timeout", "UserDataService", "LocalStorageService",
        function($q, $http, $timeout, UserDataService, LocalStorageService) {

            return {
               
                authenticate: function(identity) {

                    if (LocalStorageService.getUserIsLogin()) return true;

                    if (identity) {
                        var login = UserDataService.isValidUser(identity);
                        if (login) return true;
                    }

                    LocalStorageService.clearUserInfo();

                    return false;
                }
               
            }
        }
    ])

    
    .factory("AuthorizationService", [
        "$rootScope", "$state", "AuthenticationService", "PermissionDataService", "LocalStorageService",
        function ($rootScope, $state, AuthenticationService, PermissionDataService, LocalStorageService) {
            return {

                authorize: function () {

                    var userInfo = LocalStorageService.getUserInfo();

                    var permission = PermissionDataService.checkUserPermission(userInfo, $rootScope.toState);

                    return permission;
                }
            };
        }
    ]);

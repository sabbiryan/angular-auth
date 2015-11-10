"use strict";

angular.module("authApp")
    .factory("AuthenticationService", [
        "$q", "$http", "$timeout", "UserDataService",
        function($q, $http, $timeout, UserDataService) {

            var _identity = undefined,
                _authenticated = false;

            return {
                isIdentityResolved: function() {
                    return angular.isDefined(_identity);
                },

                isAuthenticated: function() {
                    return _authenticated;
                },

                isInRole: function(role) {
                    if (!_authenticated || !_identity.roles)
                        return false;

                    return _identity.roles.indexOf(role) !== -1;
                },

                isInAnyRole: function(roles) {
                    if (!_authenticated || !_identity.roles)
                        return false;

                    for (var i = 0; i < roles.length; i++) {
                        if (this.isInRole(roles[i]))
                            return true;
                    }

                    return false;
                },

                authenticate: function(identity) {

                    var user = UserDataService.isValidUser(identity);

                    _identity = user;
                    _authenticated = user != null;

                    if (user) {
                        localStorage.setItem("userInfo", angular.toJson(user));
                        localStorage.setItem("isLogin", true);

                    } else {
                        localStorage.removeItem("userInfo");
                        localStorage.removeItem("isLogin");
                    }
                },

                identity: function(force) {
                    //var deferred = $q.defer();

                    if (force === true) _identity = undefined;

                    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
                    if (angular.isDefined(_identity)) {
                        //deferred.resolve(_identity);
                        //return deferred.promise;
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
                        _identity = angular.fromJson(localStorage.getItem("userInfo"));
                        self.authenticate(_identity);
                        //deferred.resolve(_identity);
                    }, 1000);

                    //return deferred.promise;
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

                    //return AuthenticationService.identity()
                    //    .then(function() {

                    //        var isAuthenticated = AuthenticationService.isAuthenticated();

                    //        //if (
                    //        //    $rootScope.toState.data.roles &&
                    //        //    $rootScope.toState.data.roles.length > 0 &&
                    //        //    !AuthenticationService.isInAnyRole($rootScope.toState.data.roles))


                    //            if (isAuthenticated)
                    //                $state.go("denied"); 

                    //            else {
                    //                $rootScope.returnToState = $rootScope.toState;
                    //                $rootScope.returnToStateParams = $rootScope.toStateParams;

                    //                $state.go("login");
                    //            }
                    //    });
                }
            };
        }
    ]);

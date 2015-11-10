"use strict";

angular.module("authApp")
    // principal is a service that tracks the user's identity. 
    // calling identity() returns a promise while it does what you need it to do
    // to look up the signed-in user's identity info. for example, it could make an 
    // HTTP request to a rest endpoint which returns the user's name, roles, etc.
    // after validating an auth token in a cookie. it will only do this identity lookup
    // once, when the application first runs. you can force re-request it by calling identity(true)
    .factory('AuthenticationService', [
        '$q', '$http', '$timeout', "Users", "Roles",
        function ($q, $http, $timeout, Users, Roles) {

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

                    return _identity.roles.indexOf(role) != -1;
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

                authenticate: function (identity) {

                    var login = false;

                    for (var user in Users) {
                        if (Users.hasOwnProperty(user)) {
                            if (identity.Username === user.Username && identity.Password === user.Password) {

                                _identity = user;
                                
                                login = true;
                                break;
                            }
                        }
                    }

                    //_identity = identity;
                    //_authenticated = identity != null;

                    // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
                    if (identity) {
                        localStorage.setItem("userInfo", angular.toJson(identity));
                        localStorage.setItem("isLogin", true);
                        //$window.sessionStorage.setItem("user", JSON.stringify(identity));
                        //sessionStorage.user = JSON.stringify(identity);
                    } else {
                        localStorage.removeItem("userInfo");
                        localStorage.removeItem("isLogin");                        
                    }
                },

                identity: function(force) {
                    var deferred = $q.defer();

                    if (force === true) _identity = undefined;

                    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
                    if (angular.isDefined(_identity)) {
                        deferred.resolve(_identity);

                        return deferred.promise;
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



                    // for the sake of the demo, we'll attempt to read the identity from localStorage. the example above might be a way if you use cookies or need to retrieve the latest identity from an api
                    // i put it in a timeout to illustrate deferred resolution

                    var self = this;
                    $timeout(function() {
                        _identity = angular.fromJson(localStorage.getItem("userInfo"));
                        self.authenticate(_identity);
                        deferred.resolve(_identity);
                    }, 1000);

                    return deferred.promise;
                }
            };
        }
    ])

    // authorization service's purpose is to wrap up authorize functionality
    // it basically just checks to see if the principal is authenticated and checks the root state 
    // to see if there is a state that needs to be authorized. if so, it does a role check.
    // this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
    // route, the app resolves your identity before it does an authorize check. after that,
    // authorize is called from $stateChangeStart to make sure the principal is allowed to change to
    // the desired state

    .factory('AuthorizationService', [
        '$rootScope', '$state', 'AuthenticationService',
        function ($rootScope, $state, AuthenticationService) {
            return {
                authorize: function() {
                    return AuthenticationService.identity()
                        .then(function() {
                            var isAuthenticated = AuthenticationService.isAuthenticated();

                            if ($rootScope.toState.data.roles &&
                                $rootScope.toState.data.roles.length > 0 &&
                                !AuthenticationService.isInAnyRole($rootScope.toState.data.roles)) {
                                if (isAuthenticated)
                                    $state.go('denied'); // user is signed in but not authorized for desired state
                                else {
                                    // user is not authenticated. stow the state they wanted before you
                                    // send them to the signin state, so you can return them when you're done
                                    $rootScope.returnToState = $rootScope.toState;
                                    $rootScope.returnToStateParams = $rootScope.toStateParams;

                                    // now, send them to the signin state so they can log in
                                    $state.go('login');
                                }
                            }
                        });
                }
            };
        }
    ]);

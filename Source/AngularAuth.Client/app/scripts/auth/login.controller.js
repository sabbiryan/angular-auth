"use strict";

angular.module("authApp")
    .controller("LoginController", [
        "$rootScope", "$scope", "$state", "AuthenticationService", "UserDataService", "$window",
        function ($rootScope, $scope, $state, AuthenticationService, UserDataService, $window) {

            $scope.credentials = {
                Username: "",
                Password: ""
            };

            $scope.login = function(credentials) {

                var authenticate = UserDataService.isValidUser($scope.credentials);
                AuthenticationService.authenticate($scope.credentials);

                if (authenticate) {

                    $rootScope.$broadcast('loggedIn');

                    if ($scope.returnToState)
                        $state.go($scope.returnToState.name, $scope.returnToStateParams);
                    else
                        $state.go("home");

                } else {
                    $state.go("login", {}, { reload: true });                    
                }
            };

            
        }
    ]);
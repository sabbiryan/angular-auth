"use strict";

angular.module("authApp")
    .controller("LoginController", [
        "$scope", "$state", "AuthenticationService", "UserDataService", "$window",
        function ($scope, $state, AuthenticationService, UserDataService, $window) {                        

            $scope.credentials = {
                Username: "",
                Password: ""
            };

            $scope.login = function(credentials) {

                var authenticate = UserDataService.isValidUser($scope.credentials);
                AuthenticationService.authenticate($scope.credentials);

                if (authenticate) {

                    if ($scope.returnToState)
                        $state.go($scope.returnToState.name, $scope.returnToStateParams);

                    else
                        $state.go("home");

                } else {
                    $state.go("login");
                }
            };

            
        }
    ]);
"use strict";

angular.module("authApp")
    .controller('LoginController', [
        '$scope', '$state', 'AuthenticationService',
        function($scope, $state, AuthenticationService) {


            $scope.login = function(credentials) {

                $scope.credentials =
                {
                    Username: credentials.Username,
                    Password: credentials.Password,
                    //roles: ["User"]
                };

                
                AuthenticationService.authenticate($scope.credentials);
                /* 
                //here, we fake authenticating and give a fake user
                AuthenticationService.authenticate({
                    name: 'Test User',
                    roles: ['User']
                });
                */


                if ($scope.returnToState)
                    $state.go($scope.returnToState.name, $scope.returnToStateParams);
                else
                    $state.go('home');
            };
        }
    ]);
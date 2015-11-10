"use strict";

angular.module("authApp")
    .controller("AppController", [
        "$scope", "$state", "principal",
        function ($scope, $state, principal) {
            
            $scope.logout = function() {
                localStorage.clear("user");
                localStorage.clear("isLogin");

                $state.go("login");
            }
        }
    ]);
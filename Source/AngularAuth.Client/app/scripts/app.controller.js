"use strict";

angular.module("authApp")
    .controller("AppController", [
        "$scope", "$state",
        function ($scope, $state) {
            
            $scope.logout = function() {
                localStorage.clear("user");
                localStorage.clear("isLogin");

                $state.go("login");
            }
        }
    ]);
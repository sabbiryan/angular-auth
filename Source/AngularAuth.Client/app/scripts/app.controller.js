"use strict";

angular.module("authApp")
    .controller("AppController", [
        "$scope", "$state", "$window",
        function ($scope, $state, $window) {            

            $scope.isLogin = angular.fromJson(localStorage.getItem("isLogin"));

            //if ($scope.isLogin) $window.location.reload();

            $scope.logout = function() {
                localStorage.clear("user");
                localStorage.clear("isLogin");                
                $state.go("login", {});                
            }
        }
    ]);
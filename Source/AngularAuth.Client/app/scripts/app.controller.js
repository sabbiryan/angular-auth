"use strict";

angular.module("authApp")
    .controller("AppController", [
        "$scope", "$state", "$window", "LocalStorageService",
        function ($scope, $state, $window, LocalStorageService) {

            $scope.isLogin = LocalStorageService.getUserIsLogin();

            $scope.logout = function() {
                LocalStorageService.clearUserInfo();

                $state.go("login", {}, {reload: true});                
            }
            
        }
    ]);
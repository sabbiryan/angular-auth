"use strict";

angular.module("authApp")
    .controller("AppController", [
        "$rootScope", "$scope", "$state", "$window", "LocalStorageService",
        function ($rootScope, $scope, $state, $window, LocalStorageService) {

            $scope.isLogin = LocalStorageService.getUserIsLogin();

            $scope.logout = function () {
                $scope.isLogin = false;
                LocalStorageService.clearUserInfo();
                $rootScope.$broadcast('loggedOut');
                $state.go("login", {}, {reload: true});                
            }

            $rootScope.$on('loggedIn', function(event, args) {
                console.log(event);
                $scope.isLogin = LocalStorageService.getUserIsLogin();
            });

            $rootScope.$on('loggedOut', function (event, args) {
                console.log(event);
            });

        }
    ]);
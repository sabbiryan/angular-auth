"use strict";

angular.module("authApp")
    .controller('HomeController', [
        '$scope', '$state', 'principal',
        function ($scope, $state, principal) {
            $scope.signout = function () {
                principal.authenticate(null);
                $state.go('signin');
            };
        }
    ]);
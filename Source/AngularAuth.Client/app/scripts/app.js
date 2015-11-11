"use strict";

angular.module("authApp", ["ui.router", "ngResource"])
    .config([
        "$stateProvider", "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state("site", {
                    'abstract': true,
                    url: "",                    
                    template: "<div ui-view class=\"container slide\"></div>",
                    controller: "AppController"

                })
                .state("home", {
                    parent: "site",
                    url: "/",
                    views: {
                        '': {
                            templateUrl: "views/home/home.tpl.html",
                            controller: "HomeController"
                        }
                    }
                });

        }
    ])
    .run([
        "$rootScope", "$state", "$stateParams", "AuthorizationService", "AuthenticationService",
        function($rootScope, $state, $stateParams, AuthorizationService, AuthenticationService) {

            $rootScope.$on("$stateChangeStart", function(event, toState, toStateParams) {

                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                var isLogin = toState.name === "login";
                if (isLogin) return;

                var isAccessDenied = toState.name === "denied";
                if (isAccessDenied) return;

                

                if (!AuthenticationService.isIdentityResolved()) {
                    event.preventDefault();
                    $state.go("login");
                }

                if (AuthenticationService.isIdentityResolved()) {
                    if (!AuthorizationService.authorize()) {
                        event.preventDefault();
                        $state.go("denied");
                    }

                }


            });
        }
    ]);
    
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
                    resolve: {
                        authorize: [
                            "AuthorizationService",
                            function (AuthorizationService) {
                                return AuthorizationService.authorize();
                            }
                        ]
                    },
                    template: "<div ui-view class=\"container slide\"></div>"
                })
                .state("home", {
                    parent: "site",
                    url: "/",
                    data: {
                        roles: ["Admin"]
                    },
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
        function ($rootScope, $state, $stateParams, AuthorizationService, AuthenticationService) {

            $rootScope.$on("$stateChangeStart", function (event, toState, toStateParams) {

                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                if (AuthenticationService.isIdentityResolved())
                    AuthorizationService.authorize();
            });
        }
    ]);
    
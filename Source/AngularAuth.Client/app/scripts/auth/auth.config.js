"use strict";

angular.module("authApp")
    .config([
        "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRoutterProvider) {
            $stateProvider
                .state('login', {
                    parent: 'site',
                    url: '/login',
                    data: {
                        roles: []
                    },
                    resolve: {
                        Roles : ["RoleDataService", 
                            function(RoleDataService) {
                                return RoleDataService.get();
                            }
                        ],
                        Users: ["UserListDataService", function(UserListDataService) {
                            return UserListDataService.get();
                        }]
                    },
                    views: {
                        '': {
                            templateUrl: 'views/auth/login.tpl.html',
                            controller: 'LoginController'
                        }
                    }
                })
                .state('admin', {
                    parent: 'site',
                    url: '/admin',
                    data: {
                        roles: ['Admin']
                    },
                    views: {
                        '': {
                            templateUrl: 'views/admin/admin.tpl.html'
                        }
                    }
                })
                .state('denied', {
                    parent: 'site',
                    url: '/access-denied',
                    data: {
                        roles: []
                    },
                    views: {
                        '': {
                            templateUrl: 'views/auth/denied.tpl.html'
                        }
                    }
                });

        }
    ]);
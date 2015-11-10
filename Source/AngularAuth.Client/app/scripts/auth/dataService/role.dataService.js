"use strict";

angular.module("authApp")
    .service("RoleDataService", [
         function() {
             return {
                 get: function () {
                     this.roles = [
                         { Id: 1, Name: "Admin" },
                         { Id: 2, Name: "Manager" },
                         { Id: 3, Name: "Customer" }
                     ];

                     return this.roles;
                 }
             }
        }
    ]);
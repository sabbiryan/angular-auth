"use strict";

angular.module("authApp")
.service("UserListDataService", [

    function() {
        return {
            get: function() {
                this.userList = [
                    { Id: 1, Name: "Mr. X", Username: "user-x", Password: "123", RoleId: 1 },
                    { Id: 2, Name: "Mr. Y", Username: "user-y", Password: "123", RoleId: 2 },
                    { Id: 3, Name: "Mr. Z", Username: "user-z", Password: "123", RoleId: 3 },
                    { Id: 4, Name: "Mr. W", Username: "user-w", Password: "123", RoleId: 1 },
                    { Id: 5, Name: "Mr. K", Username: "user-k", Password: "123", RoleId: 2 },
                ];

                return this.userList;
            }
        }
    }
])
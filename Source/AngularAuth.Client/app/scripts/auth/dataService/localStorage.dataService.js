"use strict";


angular.module("authApp")
    .service("LocalStorageService", [
        function() {
            
            return {

                setUserInfo: function(userInfo) {
                    localStorage.setItem("userInfo", angular.toJson(userInfo));
                    localStorage.setItem("isLogin", true);
                },


                getIsLogin: function() {
                    return localStorage.getItem("isLogin");
                },


                getUserInfo: function () {
                    this.userInfo = angular.fromJson(localStorage.getItem("userInfo"));

                    return this.userInfo;

                },


                clearUserInfo : function() {
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("isLogin");
                }
            }
        }
    ]);
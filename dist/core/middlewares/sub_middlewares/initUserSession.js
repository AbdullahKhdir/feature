"use strict";
var _this = this;
var Singleton_1 = require("../../Singleton/Singleton");
var updateCurrentUser = function (request, response) {
    var Cart = require("../../app/models/shop/Cart");
    var Product = require("../../app/models/shop/Product");
    var Order = require("../../app/models/shop/Order");
    var currentUser = request.session.currentUser || {};
    request.session.currentUser = Object.assign(currentUser, {
        getCart: function () { return new Cart().filter({ user_id: currentUser.id }); },
        getProducts: function () { return new Product().filter({ user_id: currentUser.id }); },
        getOrder: function () { return new Order().filter({ user_id: currentUser.id }); }
    });
    request.session.save(function (err) {
        if (err) {
            return _this.onError(response, err);
        }
    });
};
var isUserAuthenticated = function (request) {
    return (request.session.isUserAuthenticated !== undefined &&
        request.session.currentUser &&
        typeof request.session.currentUser !== "undefined");
};
var redirectToLogin = function (res) {
    return res.redirect(Singleton_1.Singleton.getConstants().HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
};
module.exports = function (request, response, next) {
    if (request.method === "GET") {
        if (isUserAuthenticated(request)) {
            updateCurrentUser(request, response);
            return next();
        }
        else {
            return redirectToLogin(response);
        }
    }
    else if (isUserAuthenticated(request)) {
        updateCurrentUser(request, response);
        return next();
    }
    else if (request.method === "POST" &&
        request.url !== "/login/" &&
        request.url !== "/login" &&
        request.url !== "/signup/" &&
        request.url !== "/signup") {
        return redirectToLogin(response);
    }
    else {
        return next();
    }
};

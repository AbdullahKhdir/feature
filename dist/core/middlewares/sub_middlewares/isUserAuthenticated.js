"use strict";
var _this = this;
module.exports = function (request, response, next) {
    if (request.method === "GET") {
        if (request.url === "/login" || request.url === "/login/") {
            if (typeof request.session.isUserAuthenticated === "undefined") {
                next();
            }
            else {
                return response.redirect("/");
            }
        }
        else if (request.url === "/signup/" || request.url === "/signup") {
            if (typeof request.session.isUserAuthenticated === "undefined") {
                next();
            }
            else {
                return response.redirect("/");
            }
        }
        else {
            if (typeof request.session.isUserAuthenticated === "undefined") {
                request.session.redirectUrl = request.headers.referer || request.originalUrl || request.url;
                return response.redirect(_this.constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
            }
            else {
                next();
            }
        }
    }
    else {
        if (typeof request.session.isUserAuthenticated === "undefined") {
            request.session.redirectUrl = request.headers.referer || request.originalUrl || request.url;
            return response.redirect(_this.constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, "/login");
        }
        else {
            next();
        }
    }
};

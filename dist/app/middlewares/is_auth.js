"use strict";
var Singleton_1 = require("../../core/Singleton/Singleton");
var constants = Singleton_1.Singleton.getConstants();
module.exports = function (req, res, next) {
    if (req.method === 'GET') {
        if (req.url === '/login') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            }
            else {
                return res.redirect('/');
            }
        }
        else if (req.url === '/signup/') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            }
            else {
                return res.redirect('/');
            }
        }
        else {
            if (typeof req.session.is_authenticated === 'undefined') {
                req.session.redirectUrl = req.headers.referer || req.originalUrl || req.url;
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            }
            else {
                next();
            }
        }
    }
    else {
        if (typeof req.session.is_authenticated === 'undefined') {
            req.session.redirectUrl = req.headers.referer || req.originalUrl || req.url;
            return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
        }
        else {
            next();
        }
    }
};

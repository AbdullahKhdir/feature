"use strict";
var _this = this;
var Singleton_1 = require("../../core/Singleton/Singleton");
var constants = Singleton_1.Singleton.getConstants();
var __ = Singleton_1.Singleton.getLodash();
module.exports = function (req, res, next) {
    var _next = false;
    if (req.method === 'GET') {
        if (typeof req.session.is_authenticated !== 'undefined') {
            if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
                _next = true;
                req.session.currentUser = Object.assign(req.session.currentUser, {
                    getCart: function () {
                        var Cart = require('../models/shop/Cart');
                        var cart_model = new Cart();
                        return cart_model.filter({ user_id: req.session.currentUser.id });
                    },
                    getProducts: function () {
                        var Product = require('../models/shop/Product');
                        var product_model = new Product();
                        return product_model.filter({ user_id: req.session.currentUser.id });
                    },
                    getOrder: function () {
                        var Order = require('../models/shop/Order');
                        var order_model = new Order();
                        return order_model.filter({ user_id: req.session.currentUser.id });
                    }
                });
                req.session.save(function (err) {
                    if (err) {
                        // @ts-ignore 
                        return _this.onError(res, err);
                    }
                });
            }
            else {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            }
        }
        next();
    }
    else {
        if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
            _next = true;
            req.session.currentUser = Object.assign(req.session.currentUser, {
                getCart: function () {
                    var Cart = require('../models/shop/Cart');
                    var cart_model = new Cart();
                    return cart_model.filter({ user_id: req.session.currentUser.id });
                },
                getProducts: function () {
                    var Product = require('../models/shop/Product');
                    var product_model = new Product();
                    return product_model.filter({ user_id: req.session.currentUser.id });
                },
                getOrder: function () {
                    var Order = require('../models/shop/Order');
                    var order_model = new Order();
                    return order_model.filter({ user_id: req.session.currentUser.id });
                }
            });
            req.session.save(function (err) {
                if (err) {
                    // @ts-ignore 
                    return _this.onError(res, err);
                }
            });
            next();
        }
        else {
            if (req.url !== '/login/' && req.url !== '/signup/' && req.method === 'POST') {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            }
            else {
                next();
            }
        }
    }
};

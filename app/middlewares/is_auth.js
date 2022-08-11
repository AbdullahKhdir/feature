const Constants = require('../utils/Constants');
const Lodash = require('../utils/Lodash');
const constants = Object.assign(new Constants().getConstants());
const __        = new Lodash().__;

/*
* Middleware To check if user has logged in to save the login in data in the session
*/
module.exports = (req, res, next) => {
    let _next = false;
    if (req.method === 'GET') {
        if (req.url === '/login') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            } else {
                return res.redirect('/');
            }
        } else if (req.url === '/signup/') {
            if (typeof req.session.is_authenticated === 'undefined') {
                next();
            } else {
                return res.redirect('/');
            }
        } else {
            if (typeof req.session.is_authenticated !== 'undefined') {
                if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
                    _next = true;
                    req.session.currentUser = Object.assign(req.session.currentUser, {
                        getCart: () => {
                            let Cart = require('../app/models/shop/Cart');
                            let cart_model = new Cart();
                            return cart_model.filter({user_id: req.session.currentUser.id});
                        },
                        getProducts: () => {
                            let Product = require('../app/models/shop/Product');
                            let product_model = new Product();
                            return product_model.filter({user_id: req.session.currentUser.id});
                        },
                        getOrder: () => {
                            let Order = require('../app/models/shop/Order');
                            let order_model = new Order();
                            return order_model.filter({user_id: req.session.currentUser.id});
                        }
                    });
                    req.session.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else {
                    return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
                }
            }
            if (!_next) {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            } else {
                next()
            }
        }
    } else {
        if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
            _next = true;
            req.session.currentUser = Object.assign(req.session.currentUser, {
                getCart: () => {
                    let Cart = require('../app/models/shop/Cart');
                    let cart_model = new Cart();
                    return cart_model.filter({user_id: req.session.currentUser.id});
                },
                getProducts: () => {
                    let Product = require('../app/models/shop/Product');
                    let product_model = new Product();
                    return product_model.filter({user_id: req.session.currentUser.id});
                },
                getOrder: () => {
                    let Order = require('../app/models/shop/Order');
                    let order_model = new Order();
                    return order_model.filter({user_id: req.session.currentUser.id});
                }
            });
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                }
            });
            next();
        } else {
            if (req.url !== '/login/' && req.url !== '/signup/' && req.method === 'POST') {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            } else {
                next();
            }
        }
    }
}

import { NextFunction, Request, Response } from 'express';
import { Singleton } from '../../core/Singleton/Singleton';

const constants = Singleton.getConstants();
const __        = Singleton.getLodash();

export = (req: Request, res: Response, next: NextFunction) => {
    let _next = false;
    if (req.method === 'GET') {
        if (typeof req.session.is_authenticated !== 'undefined') {
            if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
                _next = true;
                req.session.currentUser = Object.assign(req.session.currentUser, {
                    getCart: () => {
                        let Cart = require('../models/shop/Cart');
                        let cart_model = new Cart();
                        return cart_model.filter({user_id: req.session.currentUser.id});
                    },
                    getProducts: () => {
                        let Product = require('../models/shop/Product');
                        let product_model = new Product();
                        return product_model.filter({user_id: req.session.currentUser.id});
                    },
                    getOrder: () => {
                        let Order = require('../models/shop/Order');
                        let order_model = new Order();
                        return order_model.filter({user_id: req.session.currentUser.id});
                    }
                });
                req.session.save((err : any) => {
                    if (err) {
                        // @ts-ignore 
                        return this.onError(res, err);
                    }
                });
            } else {
                return res.redirect(constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/login');
            }
        }
        next()
    } else {
        if (!__.isEmpty(req.session.currentUser) || typeof req.session.currentUser !== 'undefined') {
            _next = true;
            req.session.currentUser = Object.assign(req.session.currentUser, {
                getCart: () => {
                    let Cart = require('../models/shop/Cart');
                    let cart_model = new Cart();
                    return cart_model.filter({user_id: req.session.currentUser.id});
                },
                getProducts: () => {
                    let Product = require('../models/shop/Product');
                    let product_model = new Product();
                    return product_model.filter({user_id: req.session.currentUser.id});
                },
                getOrder: () => {
                    let Order = require('../models/shop/Order');
                    let order_model = new Order();
                    return order_model.filter({user_id: req.session.currentUser.id});
                }
            });
            req.session.save((err: any) => {
                if (err) {
                    // @ts-ignore 
                    return this.onError(res, err);
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
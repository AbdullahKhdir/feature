'use strict';

const BaseController  = require("../../../core/controller/BaseController");
const Promise         = require("../../../core/utils/Promise");
const Cart            = require("../../models/shop/Cart");
const CartItem        = require("../../models/shop/CartItem");
const Product         = require("../../models/shop/Product");
const Constants       = require("../../utils/Constants");

/*
* Customer Actions 
*/
module.exports = class Shop extends BaseController{
    constructor() {
        super();
        /**
        * ! DYNAMIC ROUTES MUST BE THE LAST INDEX OF THE METHODS ARRAY
        */
        this.methods = [
            'products',
            'index',
            'cart',
            'checkout',
            'orders',
            'postCart',
            'deleteCartProducts',
            'deleteCartProduct',
            'dynProductInfo'
        ];
        this.product           = new Product();
        this.cart_object       = new Cart();
        this.cart_items_object = new CartItem();
        this.constants         = Object.assign(new Constants);

        /*
         ? DEMO OF THE CORS CONFIGURATIONS 
         */
        this.corsOptions = {
            origin:               'http://localhost:9009.com',
            methods:              ['GET'],
            preflightContinue:    false,
            maxAge:               86400,
            allowedHeaders:       ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
    }

    products           = () => this.getRouterInstance().get('/products/', Promise.asyncHandler(async (req, res, next) => {
        const user_products = req.registered_user.getProducts();
        user_products
            .then(rows => {
                return this.render(
                    res,
                    'shop/product-list',
                    {
                        products: rows ?? [],
                        page_title: 'All Products',
                        path: '/products/',
                        lodash: this._
                    }
                );
            });
    }));

    index              = () => this.getRouterInstance().get('/shop/', this.cors(this.corsOptions), Promise.asyncHandler(async (req, res, next) => {
        const user_products = req.registered_user.getProducts();
        user_products
            .then((rows) => {
                return this.render(
                    res,
                    'shop/index',
                    {
                        products: rows ?? [],
                        page_title: 'Shop',
                        path: '/',
                        lodash: this._
                    }
                );
            })
            .catch(err => console.log(err)); 
    }));

    cart               = () => this.getRouterInstance().get('/cart/', Promise.asyncHandler(async (req, res, next) => {
        const user_cart = req.registered_user.getCart();
        if (!user_cart) {
            throw new Error('User is not availabel');
        }
        user_cart
        .then(rows => {
            rows['getProducts']
            .then(users_cart => {
                users_cart['getProducts'].then(cart_products => {
                    if (cart_products.length > 0) {
                        if (!this._.isEmpty(cart_products)) {
                            this.product.filter({id: cart_products[0].product_id})
                            .then((rows) => {
                                cart_products[0]['title']      = rows[0].title;
                                cart_products[0]['product_id'] = rows[0].id;
                                return this.render(
                                    res,
                                    'shop/cart',
                                    {
                                        page_title: 'My Cart',
                                        path : '/cart/',
                                        products: cart_products,
                                        lodash: this._                                            
                                    }
                                );
                            })
                            .catch(err => console.log(err));
                        }
                    } else {
                        res.redirect(this.constants.getConstants().HTTPS_STATUS.REDIRECTION.SEE_OTHER, '/');
                    }
                });
            }); 
        })
        .catch(err => console.log(err));
    }));

    postCart           = () => this.getRouterInstance().post('/cart/', Promise.asyncHandler(async (req, res, next) => {
        const product_id = req.body.product_id ?? '';
        const user_id    = req.registered_user.id;

        this.cart_object.get({user_id: user_id}).then((rows) => {
            if (!this._.isEmpty(rows)) {
                const cart_id = rows[0].id;  
                this.cart_items_object.filter({cart_id: cart_id, product_id: product_id}).then((cart_items_rows) => {
                    if (typeof cart_items_rows !== 'undefined') {
                        const quantity = cart_items_rows[0].quantity + 1;
                        const id       = cart_items_rows[0].id; 
                        this.cart_items_object.update({quantity: quantity}, id).then((check => {
                            if (check) {
                                res.redirect('/cart/');
                            }
                        }));
                    } else {
                        const cart_item_params = {
                            cart_id: +cart_id,
                            product_id: +product_id,
                            quantity: 1
                        };
                        this.cart_items_object.create(cart_item_params).then((cart_item_element) => {
                            if (cart_item_element) {
                                res.redirect('/cart/');
                            }
                        });
                    }
                });   
            } else {
                const cart_params = {
                    user_id: user_id
                };

                this.cart_object.create(cart_params)
                .then(cart_element => {
                    const id = cart_element[0].insertId;
                    if (id) {
                        this.cart_items_object.filter({cart_id: id, product_id: product_id}).then((cart_items_rows) => {
                            if (typeof cart_items_rows !== 'undefined') {
                                const quantity = cart_items_rows[0].quantity + 1;
                                const id       = cart_items_rows[0].id; 
                                this.cart_items_object.update({quantity: quantity}, id).then((check => {
                                    if (check) {
                                        res.redirect('/cart/');
                                    }
                                }));
                            } else {
                                const cart_item_params = {
                                    cart_id: +id,
                                    product_id: +product_id,
                                    quantity: 1
                                };
                                this.cart_items_object.create(cart_item_params).then((cart_item_element) => {
                                    if (cart_item_element) {
                                        res.redirect('/cart/');
                                    }
                                });
                            }
                        });  
                    }
                })
                .catch((err) => { throw err});
            }
        });
    }));

    checkout           = () => this.getRouterInstance().get('/checkout/', Promise.asyncHandler(async (req, res, next) => {
        res.render(
            'shop/checkout',
            {
                page_title: 'Checkout',
                path : '/checkout/'
            }
        );
    }));

    orders             = () => this.getRouterInstance().get('/orders/', Promise.asyncHandler(async (req, res, next) => {
        res.render(
            'shop/orders',
            {
                page_title: 'My Orders',
                path : '/orders/'
            }
        );
    }));

    dynProductInfo     = () => this.getRouterInstance().get('/products/:productId/', Promise.asyncHandler(async (req, res, next) => {
        const product_id = +req.params.productId ?? false;
        const user_id = +req.registered_user.id ?? false;
        
        this.product.get({id: product_id, user_id: user_id}).then(rows => {
            if (rows) {
                const product = rows[0];
                res.render(
                    'shop/product-detail',
                    {
                        page_title: product.title ?? 'Product Details',
                        path: '/products/',
                        product: product ?? [],
                        lodash: this._
                    }
                );
            }
        })
        .catch((err) => {
            throw err
        });
    }));
    
    deleteCartProducts = () => this.getRouterInstance().post('/cart/delete-items/', Promise.asyncHandler(async (req, res, next) => {
        const cart_item_product_id = req.body.product_id ?? false;
        if (cart_item_product_id) {
            this.cart_items_object.filter({product_id: cart_item_product_id}).then((result) => {
                if (result) {
                    this.cart_items_object.delete({product_id: cart_item_product_id})
                        .then((result) => {
                            if (result[0].affectedRows > 0) {
                                res.redirect('/cart/');
                            }
                        })
                        .catch(err => console.log(err));
                }
            });
        }
    }));

    deleteCartProduct  = () => this.getRouterInstance().post('/cart/delete-item/', Promise.asyncHandler(async (req, res, next) => {
        const cart_item_product_id = req.body.product_id ?? false;
        if (cart_item_product_id) {
            this.cart_items_object.filter({product_id: cart_item_product_id}).then((result) => {
                if (result) {
                    if (result[0].quantity > 1) {
                        this.cart_items_object.update({quantity: result[0].quantity - 1}, result[0].id)
                            .then((result) => {
                                if (result) {
                                    res.redirect('/cart/');
                                }
                            })
                            .catch(err => console.log(err));
                    } else {
                        this.cart_items_object.delete({product_id: cart_item_product_id})
                            .then((result) => {
                                if (result[0].affectedRows > 0) {
                                    res.redirect('/cart/');
                                }
                            })
                            .catch(err => console.log(err));
                    }
                }
            });
        }
    }));
}
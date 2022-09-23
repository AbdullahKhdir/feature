'use strict';

import { NextFunction, Request, Response, Router } from 'express';
import { check, validationResult } from 'express-validator';
import BaseController from "../../../core/controller/BaseController";
import userSession from "../../middlewares/init_user_session";
import isAuth from "../../middlewares/is_auth";
import Cart from "../../models/shop/Cart";
import CartItem from "../../models/shop/CartItem";
import Order from "../../models/shop/Order";
import OrderItem from "../../models/shop/OrderItem";
import Product from "../../models/shop/Product";

/**
 * @class Shop
 * @constructor
 * @extends BaseController
 * @description Class Shop is the main controller
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Shop extends BaseController {
    public    methods;
    protected product: Product;
    protected cart_object: Cart;
    protected order_object: Order;
    protected cart_items_object: CartItem;
    protected order_items_object: OrderItem;
    constructor() {
        super();
        /**
        * ! DYNAMIC ROUTES MUST BE THE LAST INDEX OF THE METHODS ARRAY
        */
        this.methods = [
            'index',
            'products',
            'cart',
            'checkout',
            'orders',
            'postOrders',
            'postCart',
            'deleteCartProducts',
            'deleteCartProduct',
            'dynProductInfo'
        ];
        this.product            = new Product();
        this.cart_object        = new Cart();
        this.order_object       = new Order();
        this.cart_items_object  = new CartItem();
        this.order_items_object = new OrderItem();
    }

    //**********\\
    //* Routes *\\
    //**********\\

    /**
     * @function products
     * @description products route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    products = (): Router => this.route('get', '/products/', {userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        // TODO: Add public products
        /*
        * User specific products 
        */
        const user_products = req.getCurrentUser() ? req.getCurrentUser().getProducts(): false;
        if (typeof user_products === 'object') {
            user_products
                .then((rows: any) => {
                    return this.render(
                        res,
                        'shop/product-list',
                        {
                            products: rows,
                            nav_title: 'Products',
                            path: '/products/',
                            root: 'shop',
                            breadcrumbs: [
                                {
                                    title: 'Shop',
                                    url: '/'
                                },
                                {
                                    title: 'Products',
                                    url: '/products/'
                                }
                            ]
                        }
                    );
                })
                .catch((err: any) => this.onError(err));
        } else {
            return res.render(
                'shop/product-list',
                {
                    products: [],
                    nav_title: 'Products',
                    path: '/products/',
                    root: 'shop',
                    breadcrumbs: [
                        {
                            title: 'Shop',
                            url: '/'
                        },
                        {
                            title: 'Products',
                            url: '/products/'
                        }
                    ]
                }
            );
        }
    });
    
    /**
     * @function index
     * @description index route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    index = (): Router => this.route('get', '/', {userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        // Todo: adding breadcrumbs and importing of .js and .css files to a template after the route name (routeName() === template_name.ejs)
        // TODO: Add public products
        
        /*
        * User specific products
        */
        const user_products   = req.getCurrentUser() ? req.getCurrentUser().getProducts(): false;
        if (typeof user_products === 'object') {
            user_products
                .then((rows: any) => {
                    return this.render(
                        res,
                        'shop/index',
                        {
                            products: rows ?? [],
                            nav_title: 'shop',
                            path: '/',
                            root: 'shop',
                            breadcrumbs: [
                                {
                                    title: 'Shop',
                                    url: '/'
                                }
                            ]
                        }
                    );
                })
                .catch((err: any) => this.onError(err)); 
        } else {
            return this.render(
                res,
                'shop/index',
                {
                    products: [],
                    nav_title: 'shop',
                    path: '/',
                    success: res.locals['success'],
                    root: 'shop',
                    breadcrumbs: [
                        {
                            title: 'Shop',
                            url: '/'
                        }
                    ]
                }
            );
        }
    });

    /**
     * @function cart
     * @description cart route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    cart = (): Router => this.route('get', '/cart/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.updatedContentAlways();
        const user_cart = req.getCurrentUser().getCart() ?? [];
        if (!user_cart) {
            return this.onError(res, new Error('User is not available'))
        }
        user_cart
        .then((rows: any) => {
            if (rows) {
                if (typeof rows['getProducts'] !== 'undefined') {
                    rows['getProducts']
                    .then((cart_products: any) => {
                        if (cart_products['getProducts'].length > 0) {
                            cart_products = cart_products['getProducts'];
                            if (!this.__.isEmpty(cart_products)) {
                                let where_clause: any;
                                cart_products.forEach((cart_product: any, index: any) => {
                                    if (index > 0) {
                                        where_clause = where_clause + ' or id = '+ cart_products[index].product_id;
                                    } else {
                                        where_clause = 'id = '+ cart_products[index].product_id;
                                    }
                                });
                                this.product.filter(where_clause)
                                .then((rows: any) => {
                                    cart_products.forEach((cart_product: any, index: any) => {
                                        rows.forEach((_row: any, row_index: any) => {
                                            if (_row.id === cart_product.product_id) {
                                                cart_product['title']       = _row.title;
                                                cart_product['description'] = _row.description;
                                                cart_product['imageUrl']    = _row.imageUrl;
                                                cart_product['product_id']  = _row.id;
                                                cart_product['price']       = _row.price;
                                            }
                                        });
                                    });
                                    return this.render(
                                        res,
                                        'shop/cart',
                                        {
                                            nav_title: 'My Cart',
                                            path : '/cart/',
                                            products: cart_products,
                                            root: 'shop',
                                            css: [
                                                'materialize/gallery_materialized.css',
                                                'materialize/theme.min.css',
                                            ],
                                            breadcrumbs: [
                                                {
                                                    title: 'Shop',
                                                    url: '/'
                                                },
                                                {
                                                    title: 'Cart',
                                                    url: ''
                                                }
                                            ]
                                        }
                                    );
                                })
                                .catch((err: any) => this.onError(res, err));
                            }
                        } else {
                            // return this.redirect(res, '/', this.constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER);
                            return this.render(
                                res,
                                'shop/cart',
                                {
                                    nav_title: 'My Cart',
                                    path : '/cart/',
                                    root: 'shop',
                                    breadcrumbs: [
                                        {
                                            title: 'Shop',
                                            url: '/'
                                        },
                                        {
                                            title: 'Cart',
                                            url: ''
                                        }
                                    ]
                                }
                            );
                        }
                    })
                    .catch((err: any) => this.onError(res, err));
                } else {
                    return this.render(
                        res,
                        'shop/cart',
                        {
                            nav_title: 'My Cart',
                            path : '/cart/',
                            root: 'shop',
                            breadcrumbs: [
                                {
                                    title: 'Shop',
                                    url: '/'
                                },
                                {
                                    title: 'Cart',
                                    url: ''
                                }
                            ]
                        }
                    );
                }
            } else {
                return this.render(
                    res,
                    'shop/cart',
                    {
                        nav_title: 'My Cart',
                        path : '/cart/',
                        root: 'shop',
                        breadcrumbs: [
                            {
                                title: 'Shop',
                                url: '/'
                            },
                            {
                                title: 'Cart',
                                url: ''
                            }
                        ]
                    }
                );
            }
        })
        .catch((err: any) => this.onError(err));
    });

    /**
     * @function postCart
     * @description postCart route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postCart = (): Router => this.route('post', '/cart/', this.cartMiddlewares(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const errors = validationResult(req);
        const product_id = req.getFormPostedData('product_id') ?? '';
        const user_id    = req.getCurrentUser().id;

        if (errors.isEmpty()) {
            // @ts-ignore 
            this.cart_object.get({user_id: user_id}).then((rows: any) => {
                if (!this.__.isEmpty(rows)) {
                    const cart_id = rows[0].id;
                    this.cart_items_object.filter({cart_id: cart_id, product_id: product_id})
                    // @ts-ignore 
                    .then((cart_items_rows: any) => {
                        if (typeof cart_items_rows !== 'undefined') {
                            const quantity = cart_items_rows[0].quantity + 1;
                            const id       = cart_items_rows[0].id;
                            // @ts-ignore 
                            this.cart_items_object.update({quantity: quantity}, id).then(((check: any) => {
                                if (check) {
                                    return this.redirect(res, '/cart/');
                                }
                            }))
                            .catch((err: any) => this.onError(res, err));
                        } else {
                            const cart_item_params = {
                                cart_id: +cart_id,
                                product_id: +product_id,
                                quantity: 1
                            };
                            this.cart_items_object.create(cart_item_params)
                            // @ts-ignore 
                            .then((cart_item_element: any) => {
                                if (cart_item_element) {
                                    return this.redirect(res, '/cart/');
                                }
                            })
                            .catch((err: any) => this.onError(err));
                        }
                    })
                    .catch((err: any) => this.onError(err));  
                } else {
                    const cart_params = {
                        user_id: user_id
                    };
    
                    this.cart_object.create(cart_params)
                    // @ts-ignore 
                    .then((cart_element: any) => {
                        const id = cart_element[0].insertId;
                        if (id) {
                            this.cart_items_object.filter({cart_id: id, product_id: product_id})
                            // @ts-ignore 
                            .then((cart_items_rows: any) => {
                                if (typeof cart_items_rows !== 'undefined') {
                                    const quantity = cart_items_rows[0].quantity + 1;
                                    const id       = cart_items_rows[0].id; 
                                    this.cart_items_object.update({quantity: quantity}, id)
                                    // @ts-ignore 
                                    .then(((check: any) => {
                                        if (check) {
                                            return this.redirect(res, '/cart/');
                                        }
                                    }))
                                    .catch((err: any) => this.onError(err));
                                } else {
                                    const cart_item_params = {
                                        cart_id: +id,
                                        product_id: +product_id,
                                        quantity: 1
                                    };
                                    this.cart_items_object.create(cart_item_params)
                                    // @ts-ignore 
                                    .then((cart_item_element: any) => {
                                        if (cart_item_element) {
                                            return this.redirect(res, '/cart/');
                                        }
                                    })
                                    .catch((err: any) => this.onError(err));
                                }
                            })
                            .catch((err: any) => this.onError(err));  
                        }
                    })
                    .catch((err: any) => this.onError(err));
                }
            }).catch((err: any) => this.onError(err));
        } else {
            return this.onErrorValidation(res, errors.array())
        }
    });

    /**
     * @function checkout
     * @description checkout route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    checkout = (): Router => this.route('get', '/checkout/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.updatedContentAlways();
        return this.render(
            res,
            'shop/checkout',
            {
                page_title: 'Checkout',
                path : '/checkout/'
            }
        );
    });

    /**
     * @function orders
     * @description orders route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    orders = (): Router => this.route('get', '/orders/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.updatedContentAlways();
        req.getCurrentUser().getOrder().then((order: any) => {
            if (typeof order === 'undefined') {
                return this.redirect(res, '/cart');
            }
            if (order.hasOwnProperty('getProducts')) {
                order.getProducts
                .then((ordered_products: any) => {
                    if (!this.__.isEmpty(ordered_products.getProducts)) {
                        let where_clause: any;
                        ordered_products.getProducts.forEach((product: any, index: any) => {
                            if (index > 0) {
                                where_clause = where_clause + ' or id = '+ ordered_products.getProducts[index].product_id;
                            } else {
                                where_clause = 'id = '+ ordered_products.getProducts[index].product_id;
                            }
                        });
                        this.product.filter(where_clause)
                        .then((_products: any) => {
                            ordered_products.getProducts.forEach((element: any, index: any) => {
                                _products.forEach((_product: any, _index: any) => {
                                    if (+_product.id === +element.product_id) {
                                        ordered_products.getProducts[index].title       = _products[_index].title
                                        ordered_products.getProducts[index].description = _products[_index].description
                                        ordered_products.getProducts[index].price       = _products[_index].price
                                        ordered_products.getProducts[index].imageUrl    = _products[_index].imageUrl
                                    }
                                });
                            });
                            return this.render(
                                res,
                                'shop/orders',
                                {
                                    nav_title: 'My Orders',
                                    path : '/orders/',
                                    orders : ordered_products.getProducts,
                                    root: 'shop',
                                    breadcrumbs: [
                                        {
                                            title: 'Shop',
                                            url: '/'
                                        },
                                        {
                                            title: 'Cart',
                                            url: '/cart/'
                                        },
                                        {
                                            title: 'My Orders',
                                            url: `/orders/`
                                        }
                                    ]
                                }
                            );
                        })
                        .catch((err: any) => this.onError(err));
                    } else {
                        return this.redirect(res, '/cart');
                    }
                })
                .catch((err: any) => this.onError(err));
            } else {
                return this.redirect(res, '/cart');
            }
        })
        .catch((err: any) => this.onError(err));
    });

    /**
     * @function postOrders
     * @description postOrders route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postOrders = (): Router => this.route('post', '/create-order/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        const user_id    = req.getCurrentUser().id;
        
        req.getCurrentUser().getCart().then((cart: any) => {
            if (cart) {
                if (cart['getProducts']) {
                    return cart['getProducts'].then((product: any) => {
                        if (product) {
                            return product.getProducts;
                        }
                    })
                    .catch((err: any) => this.onError(res, err));
                }
            }
        })
        .then((products: any) => {
            if (products) {
                this.order_object.get({user_id: user_id}).then((rows: any) => {
                    if (!this.__.isEmpty(rows)) {
                        const order_id = rows[0].id;
                        products.forEach((product: any) => {
                            if (product) {
                                this.cart_items_object.delete(product.id);
                                this.order_items_object.filter({order_id: order_id, product_id: product.product_id})
                                .then((order_items_rows: any) => {
                                    if (typeof order_items_rows === 'undefined') {
                                        const order_item_params = {
                                            order_id: +order_id,
                                            product_id: +product.product_id,
                                            quantity: product.quantity
                                        };
                                        this.order_items_object.create(order_item_params).then((order_item_element: any) => {
                                            if (order_item_element) {
                                                if (!res.headersSent) {
                                                    return this.redirect(res, '/orders/');
                                                }
                                            }
                                        })
                                        .catch((err: any) => this.onError(err));
                                    } else if (typeof order_items_rows !== 'undefined') {
                                        order_items_rows.forEach((order_items_row: any) => {
                                            this.order_items_object.filter({id: order_items_row.id})
                                            .then((item: any) => {
                                                let order_item_id = item[0].id;
                                                let order_item_params = {
                                                    order_id: +order_id,
                                                    product_id: +product.product_id,
                                                    quantity: product.quantity
                                                };
                                                this.order_items_object.update(order_item_params, order_item_id)
                                                .then((order_item_element: any) => {
                                                    if (order_item_element) {
                                                        if (!res.headersSent) {
                                                            return this.redirect(res, '/orders/');
                                                        }
                                                    }
                                                })
                                                .catch((err: any) => this.onError(res, err));
                                            })
                                            .catch((err: any) => this.onError(res, err));
                                        });
                                    }
                                })
                                .catch((err: any) => this.onError(res, err)); 
                            }
                        });
                    } else {
                        const order_params = {
                            user_id: user_id
                        };
                        this.order_object.create(order_params)
                        .then((order_element: any) => {
                            const id = order_element[0].insertId;
                            if (id) {
                                products.forEach((product: any) => {
                                    if (product) {
                                        this.cart_items_object.delete(product.id);
                                        this.order_items_object.filter({order_id: id, product_id: product.product_id})
                                        .then((order_items_rows: any) => {
                                            if (typeof order_items_rows === 'undefined') {
                                                const order_item_params = {
                                                    order_id:   +id,
                                                    product_id: +product.product_id,
                                                    quantity:   product.quantity
                                                };
                                                this.order_items_object.create(order_item_params)
                                                .then((order_item_element: any) => {
                                                    if (order_item_element) {
                                                        if (!res.headersSent) {
                                                            return this.redirect(res, '/orders/');
                                                        }
                                                    }
                                                })
                                                .catch((err: any) => this.onError(res, err));
                                            }
                                            if (!res.headersSent) {
                                                return this.redirect(res, '/orders/');
                                            }
                                        })
                                        .catch((err: any) => this.onError(res, err));  
                                    }
                                });
                            }
                        })
                        .catch((err: any) => this.onError(err));
                    }
                })
                .catch((err: any) => this.onError(err));
            }
        })
        .catch((err: any) => this.onError(err));
    });

    /**
     * @function dynProductInfo
     * @description dynProductInfo route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    dynProductInfo = (): Router => this.route('get', '/products/:productId/', {userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.updatedContentAlways();
        let product_id = req.getDynamicParam('productId') ?? false;
        const user_id = +req.getCurrentUser().id ?? false;
        if (!isNaN(product_id)) {
            product_id = +product_id;
            this.product.get({id: product_id, user_id: user_id})
            // @ts-ignore 
            .then((rows: any) => {
                if (rows) {
                    const product = rows[0];
                    return this.render(
                        res,
                        'shop/product-detail',
                        {
                            page_title: product.title ?? 'Product Details',
                            path: '/products/',
                            product: product ?? []
                        }
                    );
                } else {
                    return this.siteNotFound(res);
                }
            })
            .catch((err: any) => this.onError(err));
        } else {
            return this.render(
                res,
                '404',
                {page_title: 'Page not found', path: '/404/'},
                null,
                this.constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND
            );
        }
    });

    /**
     * @function deleteCartProducts
     * @description deleteCartProducts route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteCartProducts = (): Router => this.route('post', '/cart/delete-items/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        const cart_item_product_id = req.getFormPostedData('product_items_id') ?? false;
        
        if (cart_item_product_id) {
            this.cart_items_object.get({product_id: cart_item_product_id}).then((result: any) => {
                if (result) {
                    this.cart_items_object.delete({product_id: cart_item_product_id})
                        .then((result: any) => {
                            if (result[0].affectedRows > 0) {
                                this.order_items_object.filter({product_id: cart_item_product_id}).then((item: any) => {
                                    if (typeof item !== 'undefined') {
                                        this.order_items_object.delete({product_id: cart_item_product_id})
                                        .then((_result: any) => {
                                            if (_result[0].affectedRows > 0) {
                                                return this.redirect(res, '/cart/');
                                            }
                                        })
                                        .catch((err: any) => this.onError(res, err));
                                    } else {
                                        return this.redirect(res, '/cart/');
                                    }
                                })
                                .catch((err: any) => this.onError(res, err));
                            }
                        })
                        .catch((err: any) => this.onError(res, err));
                }
            });
        }
    });

    /**
     * @function deleteCartProduct
     * @description deleteCartProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteCartProduct  = (): Router => this.route('post', '/cart/delete-item/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        const cart_item_product_id = req.getFormPostedData('product_id') ?? false;
        if (cart_item_product_id) {
            this.cart_items_object.get({product_id: cart_item_product_id}).then((result: any) => {
                if (result) {
                    if (+result[0].product_id === +cart_item_product_id && result[0].quantity > 1) {
                        this.cart_items_object.update({quantity: result[0].quantity - 1}, result[0].id)
                            .then((result: any) => {
                                if (result) {
                                    return this.redirect(res, '/cart/');
                                }
                            })
                            .catch((err: any) => this.onError(err));
                    } else {
                        this.cart_items_object.delete({product_id: cart_item_product_id})
                            .then((result: any) => {
                                if (result[0].affectedRows > 0) {
                                    return this.redirect(res, '/cart/');
                                }
                            })
                            .catch((err: any) => this.onError(err));
                    }
                }
            })
            .catch((err: any) => this.onError(err));
        }
    });


    //**************************************************************************
    //* Process protected functions
    //**************************************************************************

    //******************************\\
    //* Cart            middleware *\\
    //******************************\\
    protected cartMiddlewares  = () => ({
        isAuth,
        userSession,
        validate: check('product_id').isNumeric().withMessage('Product id must be a number!').bail()
    })
}
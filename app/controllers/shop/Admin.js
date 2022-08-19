'use strict';

const BaseController = require("../../../core/controller/BaseController");
const Product        = require("../../models/shop/Product");
const Lodash         = require("../../utils/Lodash");
const isAuth         = require("../../middlewares/is_auth");
const userSession    = require("../../middlewares/init_user_session");

/**
 * @class Admin
 * @constructor
 * @extends BaseController
 * @description Class Admin is the admin controller
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Admin extends BaseController {
    
    #corsOptionsDelegate;
    constructor() {
        super();
        this.methods = [
            'product',
            'addProduct',
            'products',
            'postEditedProduct',
            'deleteProduct',
            'editProduct'
        ];
        this.product_object = new Product();
        this.__ = new Lodash().__;

        /*
         ? CORS CONFIGURATIONS 
        */
        const whitelist = ['http://example1.com', 'http://example2.com'];
        this.#corsOptionsDelegate = function (req, callback) {
            let corsOptions;
            if (whitelist.indexOf(req.header('Origin')) !== -1) {
                // reflect (enable) the requested origin in the CORS response
                corsOptions = { 
                    origin:               true,
                    methods:              ['GET'],
                    preflightContinue:    false,
                    maxAge:               86400,
                    allowedHeaders:       ['Content-Type', 'Authorization'],
                    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
                }
            } else {
                // disable CORS for this request
                corsOptions = { 
                    origin:               false,
                }
            }
            callback(null, corsOptions); // callback expects two parameters: error and options
        }
    }

    /**
     * @function product
     * @description product route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    product           = () => this.route('get', '/admin/add-product/', {isAuth, userSession} , async (req, res, next) => {
        if (req.isGet()) {
            return this.render(
                res,
                'admin/add-product',
                {
                    page_title: 'Add Product',
                    path : '/admin/add-product/'
                }
            );
        }
        return this.siteNotFound(res);
    });

    /**
     * @function editProduct
     * @description editProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    editProduct       = () => this.route('get', '/admin/edit-product/:product_id/', {isAuth, userSession}, async (req, res, next) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }

        const product_id = +req.getDynamicParam('product_id') ?? false;
        const user_id    = +req.getCurrentUser().id;
        
        if (this.__.isNumber(user_id) && this.__.isNumber(product_id)) {
            this.product_object.filter({id: product_id, user_id: user_id})
            .then(rows => {
                if (!this.__.isEmpty(rows)) {
                    const product = rows[0];
                    return this.render(
                        res,
                        'admin/edit-product',
                        {
                            page_title: 'Edit Product',
                            path : '/admin/edit-product/',
                            product_id: product_id,
                            product: product
                        }
                    );
                } else {
                    return this.redirect(res, '/products/');
                }
            })
            .catch(err => console.log(err));
        } else {
            return this.redirect(res, '/');
        }
    });

    /**
     * @function postEditedProduct
     * @description postEditedProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postEditedProduct = () => this.route('post', '/admin/edit-product/', {isAuth, userSession}, async  (req, res, next) => {
            if (!req.isPost()) {
                return this.siteNotFound(res);
            }    

            const product_id  = +req.getFormPostedData(product_id) ?? false;
            const title       = this.__.capitalize(req.getFormPostedData('title')) ?? false;
            const price       = req.getFormPostedData('price') ?? false;
            const description = this.__.capitalize(req.getFormPostedData('description')) ?? false;
            const image       = req.getFormPostedData('imageUrl') ?? false;

            const values = {
                title: title,
                price: price,
                description: description,
                imageUrl: image
            };

            if (product_id) {
                this.product_object.update(values, product_id).then((result) => {
                    if (result[0].affectedRows) {
                        return res.redirect('/admin/products/');
                    }
                }).catch(err => console.log(err));
            }
    });

    /**
     * @function addProduct
     * @description addProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    addProduct        = () => this.route('post', '/admin/add-product/', {isAuth, userSession}, async (req, res, next) => {
            if (!req.isPost()) {
                return this.siteNotFound(res);
            }

            const title       = this.__.capitalize(req.getFormPostedData('title'));
            const imageUrl    = req.getFormPostedData('imageUrl');
            const description = this.__.capitalize(req.getFormPostedData('description'));
            const price       = req.getFormPostedData('price');
            const user_id     = req.getCurrentUser().id;

            this.product_object.create({title: title, imageUrl: imageUrl, description: description, price: price, user_id: user_id}).then((results) => {
                const primary_key = results[0].insertId
                if (primary_key) {
                    return this.redirect(res, '/');
                }
            }).catch(err => console.log(err));
    });

    /**
     * @function deleteProduct
     * @description deleteProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteProduct     = () => this.route('post', '/admin/delete-product/', {isAuth, userSession}, async (req, res, next) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }

        const product_id = req.getFormPostedData('product_id') ?? false;
        const user_id = +req.getCurrentUser().id ?? false;
        
        if (product_id && user_id) {
            this.product_object.get({id: product_id, user_id: user_id})
                .then(rows => {
                    if (!this.__.isEmpty(rows)) {
                        const id = rows[0].id;
                        this.product_object.delete(id).then((result) => {
                            return this.redirect(res, '/admin/products/');
                        }).catch(err => console.log(err));               
                    }
                })
                .catch(err => console.log(err));
        }
    });

    /**
     * @function products
     * @description products route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    // products          = () => this.route('get', '/admin/products/', {cors: this.cors(this.#corsOptionsDelegate), isAuth, userSession}, async (req, res, next) => {
    products          = () => this.route('get', '/admin/products/', {isAuth, userSession}, async (req, res, next) => {
        if (req.isGet()) {
            const user_products = req.getCurrentUser().getProducts();
            user_products
            .then(rows => {
                return this.render(
                    res,
                    'admin/products',
                    {
                        products: rows ?? [],
                        page_title: 'Admin Products',
                        path : '/admin/products/'
                    }
                );
            });
        }
        return this.siteNotFound(res);
    });
}
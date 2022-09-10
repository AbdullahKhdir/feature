'use strict';

import { NextFunction, Request, Response } from 'express';
import BaseController from "../../../core/controller/BaseController";
import userSession from "../../middlewares/init_user_session";
import isAuth from "../../middlewares/is_auth";
import Product from "../../models/shop/Product";

/**
 * @class Admin
 * @constructor
 * @extends BaseController
 * @description Class Admin is the admin controller
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Admin extends BaseController {
    
    protected corsOptionsDelegate: any;
    public methods: any;
    protected product_object: Product
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

        /*
         ? CORS CONFIGURATIONS 
        */
        const whitelist = ['http://example1.com', 'http://example2.com'];
        this.corsOptionsDelegate = function (req: Request, callback: Function) {
            let corsOptions;
            // @ts-ignore 
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
    product           = () => this.route('get', '/admin/add-product/', {isAuth, userSession} , async (req: Request, res: Response, next: NextFunction) => {
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
    editProduct       = () => this.route('get', '/admin/edit-product/:product_id/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }

        const product_id = +req.getDynamicParam('product_id') ?? false;
        const user_id    = +req.getCurrentUser().id;
        
        if (this.__.isNumber(user_id) && this.__.isNumber(product_id)) {
            this.product_object.get({id: product_id, user_id: user_id})
            // @ts-ignore 
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
            .catch((err: any) => this.onError(err));
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
    postEditedProduct = () => this.route('post', '/admin/edit-product/', {isAuth, userSession}, async  (req: Request, res: Response, next: NextFunction) => {
            if (!req.isPost()) {
                return this.siteNotFound(res);
            }    
            const product_id  = +req.getFormPostedData('product_id') ?? false;
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
                // @ts-ignore 
                this.product_object.update(values, product_id).then((result) => {
                    if (result[0].affectedRows) {
                        return res.redirect('/admin/products/');
                    }
                }).catch((err: any) => this.onError(err));
            }
    });

    /**
     * @function addProduct
     * @description addProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    addProduct        = () => this.route('post', '/admin/add-product/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        const title       = this.__.capitalize(req.getFormPostedData('title'));
        const imageUrl    = req.getFormPostedData('imageUrl');
        const description = this.__.capitalize(req.getFormPostedData('description'));
        const price       = req.getFormPostedData('price');
        const user_id     = req.getCurrentUser().id;

        this.product_object.create({title: title, imageUrl: imageUrl, description: description, price: price, user_id: user_id})
        // @ts-ignore 
        .then((results: any) => {
            const primary_key = results[0].insertId
            if (primary_key) {
                return this.redirect(res, '/');
            }
        }).catch((err: any) => this.onError(err));
    });

    /**
     * @function deleteProduct
     * @description deleteProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteProduct     = () => this.route('post', '/admin/delete-product/', {isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        const product_id = req.getFormPostedData('product_id') ?? false;
        const user_id = +req.getCurrentUser().id ?? false;
        
        if (product_id && user_id) {
            this.product_object.get({id: product_id, user_id: user_id})
                // @ts-ignore 
                .then((rows: any) => {
                    if (!this.__.isEmpty(rows)) {
                        const id = rows[0].id;
                        // @ts-ignore 
                        this.product_object.delete(id).then((result: any) => {
                            return this.redirect(res, '/admin/products/');
                        }).catch((err: any) => this.onError(err));               
                    }
                })
                .catch((err: any) => this.onError(err));
        }
    });

    /**
     * @function products
     * @description products route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    products          = () => this.route('get', '/admin/products/', {cors: this.express.express_cors(this.corsOptionsDelegate), isAuth, userSession}, async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isGet()) {
            return this.siteNotFound(res);
        }
        res.updatedContentAlways();
        const user_products = req.getCurrentUser().getProducts();
        user_products
        .then((rows: any) => {
            return this.render(
                res,
                'admin/products',
                {
                    products: rows ?? [],
                    page_title: 'Admin Products',
                    path : '/admin/products/'
                }
            );
        })
        .catch((err: any) => this.onError(err));
    });
}
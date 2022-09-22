'use strict';

import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
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
                    nav_title: 'Add Product',
                    path : '/admin/add-product/',
                    root: 'shop',
                    breadcrumbs: [
                        {
                            title: 'Shop',
                            url: '/'
                        },
                        {
                            title: 'Add Product',
                            url: '/admin/add-product/'
                        }
                    ]
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
            req.sendFormPostedData();
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

    //******************************\\
    //* Add Product middleware     *\\
    //******************************\\
    protected validatedNewProduct  = () => ({
        is_authenticated:     isAuth,
        user_session:         userSession,
        validate_title:       check('title').not().isEmpty().withMessage("Please enter a product's title!").bail(),
        validate_imageUrl:    check('imageUrl').not().isEmpty().isURL().withMessage("Please enter products's image url!").bail(),
        validate_description: check('description').not().isEmpty().withMessage("Please enter product's description!").bail(),
        validate_price:       check('price')
                              .isNumeric()
                              .withMessage("Please enter product's price!")
                              .bail()
    });
    /**
     * @function addProduct
     * @description addProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    addProduct        = () => this.route('post', '/admin/add-product/', this.validatedNewProduct(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        req.sendFormPostedData();
        const title       = this.__.capitalize(req.getFormPostedData('title'));
        const imageUrl    = req.getFormPostedData('imageUrl');
        const description = this.__.capitalize(req.getFormPostedData('description'));
        const price       = req.getFormPostedData('price');
        const user_id     = req.getCurrentUser().id;

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            this.product_object.create({title: title, imageUrl: imageUrl, description: description, price: price, user_id: user_id})
            .then((results: any) => {
                const primary_key = results[0].insertId
                if (primary_key) {
                    return this.redirect(res, '/');
                }
            }).catch((err: any) => this.onError(err));
        } else {
            return this.onErrorValidation(res, errors.array());
        }
    });

    //******************************\\
    //* Add Product middleware     *\\
    //******************************\\
    protected validatedDeleteProduct  = () => ({
        is_authenticated:     isAuth,
        user_session:         userSession,
        validate_title:       check('product_id').not().isEmpty().isNumeric().withMessage("Product could not be deleted, please talk to the technical team!").bail()
    });
    /**
     * @function deleteProduct
     * @description deleteProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    deleteProduct     = () => this.route('post', '/admin/delete-product/', this.validatedDeleteProduct(), async (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        res.noCacheNeeded();
        const product_id = req.getFormPostedData('product_id');
        const user_id = +req.getCurrentUser().id;
        
        const errors = validationResult(req);
        console.log(product_id)
        if (errors.isEmpty()) {
            if (product_id && user_id) {
                this.product_object.get({id: product_id, user_id: user_id})
                    .then((rows: any) => {
                        if (!this.__.isEmpty(rows)) {
                            const id = rows[0].id;
                            this.product_object.delete(id).then((result: any) => {
                                return this.redirect(res, '/admin/products/');
                            }).catch((err: any) => this.onError(res, err));
                        }
                    })
                    .catch((err: any) => this.onError(res, err));
            }
        } else {
            return this.onErrorValidation(res, errors.array());
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
                    nav_title: 'Admin Products',
                    path : '/admin/products/',
                    root: 'shop',
                    breadcrumbs: [
                        {
                            title: 'Shop',
                            url: '/'
                        },
                        {
                            title: 'Admin Product',
                            url: '/admin/products/'
                        }
                    ]
                }
            );
        })
        .catch((err: any) => this.onError(err));
    });
}
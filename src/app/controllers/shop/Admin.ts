'use strict';

import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import multer from 'multer';
import BaseController from "../../../core/controller/BaseController";
import JsonResponse from '../../../core/response/types/JsonResponse';
import { Singleton } from '../../../core/Singleton/Singleton';
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
    public    methods: any;
    protected product_object: Product
    protected upload_middleware;
    constructor() {
        super();
        this.methods = [
            'product',
            'addProduct',
            'products',
            'postEditedProduct',
            'deleteProduct',
            'editProduct',
            'uploader',
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

        //************\\
        //* UPLOADER *\\
        //************\\
        // this.uploader    = Singleton.getUploader();
        // this.uploader_configs = this.uploader.diskStorage({
            // destination: (req: Request, file: Express.Multer.File, callback: Function) => {
            //     callback(null, Singleton.getPath().join(__dirname, '..', '..', 'public', 'images'));
            // },
            // filename: (req: Request, file: Express.Multer.File, callback: Function) => {
            //     callback(null, new Date().toISOString() + '_' + file.originalname);
            // }
        // })
        // this.file_filter = (req: Request, file: Express.Multer.File, callback: Function) => {
        //     if (file.mimetype === Singleton.getConstants().RESPONSE.TYPES.PNG
        //      || file.mimetype === Singleton.getConstants().RESPONSE.TYPES.JPEG
        //      || file.mimetype === Singleton.getConstants().RESPONSE.TYPES.JPG) {
        //          callback(null, true);
        //     } else {
        //         //! FILE WILL NOT BE SAVED
        //         req.sendFormPostedData();
        //         // @ts-ignore
        //         return this.onErrorValidation(req.res, 'Only images with the (PNG, JPEG or JPG) extensions are allowed');
        //     }
        // };
        // this.upload_middleware = this.uploader({storage: this.uploader_configs, limits: {fileSize: this.file_size}, fileFilter: this.file_filter}).single('uploaded_image');
        this.upload_middleware = Singleton.configUploader({
            file_size: 10 * 1024 * 1024,
            input_name: 'uploaded_image',
            storage_type: 'diskStorage',
            upload_type: 'single',
            // @ts-ignore
            file_filter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
                if (file.mimetype === Singleton.getConstants().RESPONSE.TYPES.PNG
                || file.mimetype === Singleton.getConstants().RESPONSE.TYPES.JPEG
                || file.mimetype === Singleton.getConstants().RESPONSE.TYPES.JPG) {
                    callback(null, true);
                } else {
                    //! FILE WILL NOT BE SAVED
                    req.sendFormPostedData();
                    // @ts-ignore
                    return this.onErrorValidation(req.res, 'Only images with the (PNG, JPEG or JPG) extensions are allowed');
                }
            },
            // @ts-ignore
            storage_disk_destination_callback: (req: Request, file: Express.Multer.File, callback: Function) => {
                callback(null, Singleton.getPath().join(__dirname, '..', '..', 'public', 'images'));
            },
            // @ts-ignore
            storage_disk_filename_callback: (req: Request, file: Express.Multer.File, callback: Function) => {
                let date    = new Date();
                let year    = date.getFullYear();
                let month   = (date.getMonth() + 1);
                let day     = date.getDate();
                let hours   = date.getHours();
                let minutes = date.getMinutes();
                callback(null, `${year}_${month}_${day}_${hours}_${minutes}_${file.originalname}`);
            }
        })
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
            res.longTimeNoCache();
            // todo: test with multiple files
            const uploader_form = Singleton.buildUploader(
                {
                    extensions: ['png', 'jpeg', 'jpg'],
                    url: '/upload-image/',
                    button_name: 'Upload Image',
                    input_name: 'uploaded_image',
                    multiple_files: false,
                    max_files: 1,
                    form_id: 'form-add-product'
                }
            );
            return this.render(
                res,
                'admin/add-product',
                {
                    nav_title: 'Add Product',
                    path : '/admin/add-product/',
                    root: 'shop',
                    uploader: uploader_form,
                    // todo: check which lib is mandatory and which is not
                    js: [
                        'plugins/jquery/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
                        'plugins/jquery/blueimp-file-upload/js/load_image.js',
                        'plugins/jquery/blueimp-file-upload/js/canvas_to_blob.js',
                        'plugins/jquery/blueimp-file-upload/js/blueimp_gallery.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.iframe-transport.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.fileupload.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-process.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-image.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-audio.js',
                        'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-video.js',
                        'plugins/jquery/blueimp-file-upload/js/validate.js',
                        'plugins/jquery/blueimp-file-upload/js/cors/jquery.postmessage-transport.js',
                        'plugins/jquery/blueimp-file-upload/js/cors/jquery.xdr-transport.js',
                    ],
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
        const uploader_form = Singleton.buildUploader(
            {
                extensions: ['png', 'jpeg', 'jpg'],
                url: '/upload-image/',
                button_name: 'Upload Image',
                input_name: 'uploaded_image',
                multiple_files: false,
                max_files: 1,
                form_id: 'edit-product',
            }
        );
                
        const product_id = +req.getDynamicParam('product_id') || false;
        const user_id    = +req.getCurrentUser().id;
        
        if (this.__.isNumber(user_id) && this.__.isNumber(product_id)) {
            this.product_object.get({id: product_id, user_id: user_id})
            .then(rows => {
                if (!this.__.isEmpty(rows)) {
                    const product = rows[0];
                    return this.render(
                        res,
                        'admin/edit-product',
                        {
                            nav_title: 'Edit Product',
                            path : '/admin/edit-product/',
                            product_id: product_id,
                            product: product,
                            root: 'shop',
                            uploader: uploader_form,
                            js: [
                                'plugins/jquery/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
                                'plugins/jquery/blueimp-file-upload/js/load_image.js',
                                'plugins/jquery/blueimp-file-upload/js/canvas_to_blob.js',
                                'plugins/jquery/blueimp-file-upload/js/blueimp_gallery.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.iframe-transport.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.fileupload.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-process.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-image.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-audio.js',
                                'plugins/jquery/blueimp-file-upload/js/jquery.fileupload-video.js',
                                'plugins/jquery/blueimp-file-upload/js/validate.js',
                                'plugins/jquery/blueimp-file-upload/js/cors/jquery.postmessage-transport.js',
                                'plugins/jquery/blueimp-file-upload/js/cors/jquery.xdr-transport.js',
                            ],
                            breadcrumbs: [
                                {
                                    title: 'Shop',
                                    url: '/'
                                },
                                {
                                    title: 'Admin Products',
                                    url: '/admin/products/'
                                },
                                {
                                    title: 'Edit Product',
                                    url: `/admin/edit-product/${product_id}`
                                }
                            ]
                        }
                    );
                } else {
                    return this.redirect(res, '/products/');
                }
            })
            .catch((err: any) => this.onError(res, next, err));
        } else {
            return this.redirect(res, '/');
        }
    });

    protected validatedEditProduct  = () => ({
        is_authenticated:     isAuth,
        user_session:         userSession,
        validate_product_id:  check('product_id').not().isEmpty().withMessage("Product could not be edited, plase contact the support team!").bail(),
        validate_title:       check('title').not().isEmpty().withMessage("Please enter a product's title!").bail(),
        validate_description: check('description').not().isEmpty().withMessage("Please enter product's description!").bail(),
        validate_price:       check('price').isNumeric().withMessage("Please enter product's price!").bail(),
        validate_image_path:  check('uploaded_image').
        // @ts-ignore
        custom((value: any, {req} : Request) => {
            if (req.file) {
                if (req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.PNG)
                || req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPG)
                || req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPEG)) {
                    return true;
                }
                //! FILE WILL BE SAVED
                // return Promise.reject('Only images with the (PNG, JPEG or JPG) extensions are allowed');
            } else if (req.files) {
                if (typeof req.files['uploaded_image'] !== 'undefined') {
                    if (typeof req.files['uploaded_image'][Symbol.iterator] === 'function') {
                        req.files['uploaded_image'].forEach((image: any) => {
                            if (!image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.PNG)
                            || !image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPG)
                            || !image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPEG)) {
                                return false;
                            }   
                        });
                        return true;
                    }
                }
            }
            return true;
        }).bail(),
    });
    /**
     * @function postEditedProduct
     * @description postEditedProduct route
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Response
    */
    postEditedProduct = () => this.route('post', '/admin/edit-product/:product_id/', this.validatedEditProduct(), async  (req: Request, res: Response, next: NextFunction) => {
        if (!req.isPost()) {
            return this.siteNotFound(res);
        }
        req.sendFormPostedData();

        const product_id  = +req.getFormPostedData('product_id');
        const title       = this.__.capitalize(req.getFormPostedData('title'));
        const price       = req.getFormPostedData('price');
        const description = this.__.capitalize(req.getFormPostedData('description'));
        const image       = req.getUploadedFile() || null;
        
        const values : any = {
            title: title,
            price: price,
            description: description
        };

        if (Object.keys(image).length>  0) {
            values['imageUrl'] = `/images/${image.filename}`;
            this.product_object.get({id: product_id})
            .then((result: any) => {
                if (result) {
                    let image_path = result[0].imageUrl;
                    let fs         = Singleton.getFileSystem();
                    let path       = Singleton.getPath().join(__dirname, '..', '..', 'public', image_path);
                    if (fs.existsSync(path)) {
                        fs.unlinkSync(path);
                    }
                }
            })
            .catch((err: any) => this.onError(res, next, err));
        }
        
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            if (product_id) {
                // @ts-ignore
                this.product_object.update(values, product_id).then((result) => {
                    if (result[0].affectedRows) {
                        return res.redirect('/admin/products/');
                    }
                }).catch((err: any) => this.onError(res, next, err));
            }
        } else {
            return this.onErrorValidation(res, errors.array());
        }
    });

    //******************************\\
    //* Add Product middleware     *\\
    //******************************\\
    protected validatedNewProduct  = () => ({
        is_authenticated:     isAuth,
        user_session:         userSession,
        validate_title:       check('title').not().isEmpty().withMessage("Please enter a product's title!").bail(),
        validate_description: check('description').not().isEmpty().withMessage("Please enter product's description!").bail(),
        validate_price:       check('price').isNumeric().withMessage("Please enter product's price!").bail(),
        validate_image_path:  check('uploaded_image').
        // @ts-ignore
        custom((value: any, {req} : Request) => {
            if (req.file) {
                if (req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.PNG)
                || req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPG)
                || req.file?.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPEG)) {
                    return true;
                }
                //! FILE WILL BE SAVED
                // return Promise.reject('Only images with the (PNG, JPEG or JPG) extensions are allowed');
            } else if (req.files) {
                if (typeof req.files['uploaded_image'] !== 'undefined') {
                    if (typeof req.files['uploaded_image'][Symbol.iterator] === 'function') {
                        req.files['uploaded_image'].forEach((image: any) => {
                            if (!image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.PNG)
                            || !image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPG)
                            || !image.mimetype.includes(Singleton.getConstants().RESPONSE.TYPES.JPEG)) {
                                return false;
                            }
                        });
                        return true;
                    }
                }
            }
            return Promise.reject('Please upload an image for the product with the extensions JPG, JPEG, or PNG!');
        }).bail(),
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
        const description = this.__.capitalize(req.getFormPostedData('description'));
        const price       = req.getFormPostedData('price');
        const user_id     = req.getCurrentUser().id;
        let image         = req.getUploadedFile();

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            image = `/images/${image.filename}`;
            this.product_object.create({title: title, imageUrl: image, description: description, price: price, user_id: user_id})
            .then((results: any) => {
                const primary_key = results[0].insertId
                if (primary_key) {
                    return this.redirect(res, '/');
                }
            }).catch((err: any) => this.onError(res, next, err));
        } else {
            return this.onErrorValidation(res, errors.array());
        }
    });

    protected _uploader  = () => ({
        uploader_error_handler: (req: Request, res: Response, next: NextFunction) => {
            // @ts-ignore
            this.upload_middleware(req, res, (err: multer.MulterError) => {
                if (err instanceof multer.MulterError) {
                    switch (err.code) {
                        case Singleton.getConstants().UPLOADER_ERRORS.FILE_TOO_LARGE:
                            return this.onErrorValidation(res, 'Please upload a file with maximum size of 10 MB!')
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.TOO_MANY_PARTS:
                            return this.onErrorValidation(res, 'File exceded the allowed parts!')
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.TOO_MANY_FILES:
                            return this.onErrorValidation(res, 'Too many files uploaded, please upload less files!')
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.FIELD_NAME_TOO_LONG:
                            return this.onErrorValidation(res, "Field name is too long, please insert a short fields's name!")
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.FIELD_VALUE_TOO_LONG:
                            return this.onErrorValidation(res, "Field value is too long, please insert a short fields's value!")
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.TOO_MANY_FIELDS:
                            return this.onErrorValidation(res, "Alot of fields have been detected, please use less fields!")
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.UNEXPECTED_FIELD:
                            return this.onErrorValidation(res, "Unexpected field detected, please check your fields!")
                            break;
                        case Singleton.getConstants().UPLOADER_ERRORS.FIELD_NAME_MISSING:
                            return this.onErrorValidation(res, "Field's name is missing, please validate your fields!")
                            break;
                        default:
                            next()
                            break;
                    }
                }
                next();
            })
        },
        is_authenticated:     isAuth,
        user_session:         userSession,
    });
    uploader = () => this.route('post', '/upload-image/', this._uploader(), async (req: Request, res: Response, next: NextFunction) => {
        const uploaded_file = JSON.stringify(req.getUploadedFiles());
        return new JsonResponse(200, 'Success', {upload_object: uploaded_file}).sendAsJson(res);
    });

    //******************************\\
    //* Delete Product middleware  *\\
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
        
        if (errors.isEmpty()) {
            if (product_id && user_id) {
                this.product_object.get({id: product_id, user_id: user_id})
                    .then((rows: any) => {
                        if (!this.__.isEmpty(rows)) {
                            let image_path = rows[0].imageUrl;
                            let fs         = Singleton.getFileSystem();
                            let path       = Singleton.getPath().join(__dirname, '..', '..', 'public', image_path);
                            if (fs.existsSync(path)) {
                                fs.unlink(path, (err: any) => {
                                    if (err) {
                                        return this.onError(res, next, err);
                                    }
                                    const id = rows[0].id;
                                    this.product_object.delete(id)
                                    .then((result: any) => {
                                        return this.redirect(res, '/admin/products/');
                                    })
                                    .catch((err: any) => this.onError(res, next, err));
                                })
                            }
                        }
                    })
                    .catch((err: any) => this.onError(res, next, err));
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
                    products: rows || [],
                    nav_title: 'Admin Products',
                    path : '/admin/products/',
                    root: 'shop',
                    breadcrumbs: [
                        {
                            title: 'Shop',
                            url: '/'
                        },
                        {
                            title: 'Admin Products',
                            url: '/admin/products/'
                        }
                    ]
                }
            );
        })
        .catch((err: any) => this.onError(res, next, err));
    });
}
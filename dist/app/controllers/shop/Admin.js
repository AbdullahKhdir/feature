'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_validator_1 = require("express-validator");
var BaseController_1 = __importDefault(require("../../../core/controller/BaseController"));
var init_user_session_1 = __importDefault(require("../../middlewares/init_user_session"));
var is_auth_1 = __importDefault(require("../../middlewares/is_auth"));
var Product_1 = __importDefault(require("../../models/shop/Product"));
module.exports = /** @class */ (function (_super) {
    __extends(Admin, _super);
    function Admin() {
        var _this = _super.call(this) || this;
        /**
         * @function product
         * @description product route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.product = function () { return _this.route('get', '/admin/add-product/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.isGet()) {
                    return [2 /*return*/, this.render(res, 'admin/add-product', {
                            nav_title: 'Add Product',
                            path: '/admin/add-product/',
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
                        })];
                }
                return [2 /*return*/, this.siteNotFound(res)];
            });
        }); }); };
        /**
         * @function editProduct
         * @description editProduct route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.editProduct = function () { return _this.route('get', '/admin/edit-product/:product_id/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var product_id, user_id;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                product_id = (_a = +req.getDynamicParam('product_id')) !== null && _a !== void 0 ? _a : false;
                user_id = +req.getCurrentUser().id;
                if (this.__.isNumber(user_id) && this.__.isNumber(product_id)) {
                    this.product_object.get({ id: product_id, user_id: user_id })
                        // @ts-ignore 
                        .then(function (rows) {
                        if (!_this.__.isEmpty(rows)) {
                            var product = rows[0];
                            return _this.render(res, 'admin/edit-product', {
                                page_title: 'Edit Product',
                                path: '/admin/edit-product/',
                                product_id: product_id,
                                product: product
                            });
                        }
                        else {
                            return _this.redirect(res, '/products/');
                        }
                    })
                        .catch(function (err) { return _this.onError(err); });
                }
                else {
                    return [2 /*return*/, this.redirect(res, '/')];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postEditedProduct
         * @description postEditedProduct route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postEditedProduct = function () { return _this.route('post', '/admin/edit-product/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var product_id, title, price, description, image, values;
            var _this = this;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                req.sendFormPostedData();
                product_id = (_a = +req.getFormPostedData('product_id')) !== null && _a !== void 0 ? _a : false;
                title = (_b = this.__.capitalize(req.getFormPostedData('title'))) !== null && _b !== void 0 ? _b : false;
                price = (_c = req.getFormPostedData('price')) !== null && _c !== void 0 ? _c : false;
                description = (_d = this.__.capitalize(req.getFormPostedData('description'))) !== null && _d !== void 0 ? _d : false;
                image = (_e = req.getFormPostedData('imageUrl')) !== null && _e !== void 0 ? _e : false;
                values = {
                    title: title,
                    price: price,
                    description: description,
                    imageUrl: image
                };
                if (product_id) {
                    // @ts-ignore 
                    this.product_object.update(values, product_id).then(function (result) {
                        if (result[0].affectedRows) {
                            return res.redirect('/admin/products/');
                        }
                    }).catch(function (err) { return _this.onError(err); });
                }
                return [2 /*return*/];
            });
        }); }); };
        //******************************\\
        //* Add Product middleware     *\\
        //******************************\\
        _this.validatedNewProduct = function () { return ({
            is_authenticated: is_auth_1.default,
            user_session: init_user_session_1.default,
            validate_title: (0, express_validator_1.check)('title').not().isEmpty().withMessage("Please enter a product's title!").bail(),
            validate_imageUrl: (0, express_validator_1.check)('imageUrl').not().isEmpty().isURL().withMessage("Please enter products's image url!").bail(),
            validate_description: (0, express_validator_1.check)('description').not().isEmpty().withMessage("Please enter product's description!").bail(),
            validate_price: (0, express_validator_1.check)('price')
                .isNumeric()
                .withMessage("Please enter product's price!")
                .bail()
        }); };
        /**
         * @function addProduct
         * @description addProduct route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.addProduct = function () { return _this.route('post', '/admin/add-product/', _this.validatedNewProduct(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var title, imageUrl, description, price, user_id, errors;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                req.sendFormPostedData();
                title = this.__.capitalize(req.getFormPostedData('title'));
                imageUrl = req.getFormPostedData('imageUrl');
                description = this.__.capitalize(req.getFormPostedData('description'));
                price = req.getFormPostedData('price');
                user_id = req.getCurrentUser().id;
                errors = (0, express_validator_1.validationResult)(req);
                if (errors.isEmpty()) {
                    this.product_object.create({ title: title, imageUrl: imageUrl, description: description, price: price, user_id: user_id })
                        .then(function (results) {
                        var primary_key = results[0].insertId;
                        if (primary_key) {
                            return _this.redirect(res, '/');
                        }
                    }).catch(function (err) { return _this.onError(err); });
                }
                else {
                    return [2 /*return*/, this.onErrorValidation(res, errors.array())];
                }
                return [2 /*return*/];
            });
        }); }); };
        //******************************\\
        //* Add Product middleware     *\\
        //******************************\\
        _this.validatedDeleteProduct = function () { return ({
            is_authenticated: is_auth_1.default,
            user_session: init_user_session_1.default,
            validate_title: (0, express_validator_1.check)('product_id').not().isEmpty().isNumeric().withMessage("Product could not be deleted, please talk to the technical team!").bail()
        }); };
        /**
         * @function deleteProduct
         * @description deleteProduct route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.deleteProduct = function () { return _this.route('post', '/admin/delete-product/', _this.validatedDeleteProduct(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var product_id, user_id, errors;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                product_id = req.getFormPostedData('product_id');
                user_id = +req.getCurrentUser().id;
                errors = (0, express_validator_1.validationResult)(req);
                console.log(product_id);
                if (errors.isEmpty()) {
                    if (product_id && user_id) {
                        this.product_object.get({ id: product_id, user_id: user_id })
                            .then(function (rows) {
                            if (!_this.__.isEmpty(rows)) {
                                var id = rows[0].id;
                                _this.product_object.delete(id).then(function (result) {
                                    return _this.redirect(res, '/admin/products/');
                                }).catch(function (err) { return _this.onError(res, err); });
                            }
                        })
                            .catch(function (err) { return _this.onError(res, err); });
                    }
                }
                else {
                    return [2 /*return*/, this.onErrorValidation(res, errors.array())];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function products
         * @description products route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.products = function () { return _this.route('get', '/admin/products/', { cors: _this.express.express_cors(_this.corsOptionsDelegate), isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_products;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                user_products = req.getCurrentUser().getProducts();
                user_products
                    .then(function (rows) {
                    return _this.render(res, 'admin/products', {
                        products: rows !== null && rows !== void 0 ? rows : [],
                        nav_title: 'Admin Products',
                        path: '/admin/products/',
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
                    });
                })
                    .catch(function (err) { return _this.onError(err); });
                return [2 /*return*/];
            });
        }); }); };
        _this.methods = [
            'product',
            'addProduct',
            'products',
            'postEditedProduct',
            'deleteProduct',
            'editProduct'
        ];
        _this.product_object = new Product_1.default();
        /*
         ? CORS CONFIGURATIONS
        */
        var whitelist = ['http://example1.com', 'http://example2.com'];
        _this.corsOptionsDelegate = function (req, callback) {
            var corsOptions;
            // @ts-ignore 
            if (whitelist.indexOf(req.header('Origin')) !== -1) {
                // reflect (enable) the requested origin in the CORS response
                corsOptions = {
                    origin: true,
                    methods: ['GET'],
                    preflightContinue: false,
                    maxAge: 86400,
                    allowedHeaders: ['Content-Type', 'Authorization'],
                    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
                };
            }
            else {
                // disable CORS for this request
                corsOptions = {
                    origin: false,
                };
            }
            callback(null, corsOptions); // callback expects two parameters: error and options
        };
        return _this;
    }
    return Admin;
}(BaseController_1.default));

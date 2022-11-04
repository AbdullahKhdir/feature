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
var csurf_1 = __importDefault(require("csurf"));
var express_validator_1 = require("express-validator");
var BaseController_1 = __importDefault(require("../../../core/controller/BaseController"));
var Singleton_1 = require("../../../core/Singleton/Singleton");
var init_user_session_1 = __importDefault(require("../../middlewares/init_user_session"));
var is_auth_1 = __importDefault(require("../../middlewares/is_auth"));
var Cart_1 = __importDefault(require("../../models/shop/Cart"));
var CartItem_1 = __importDefault(require("../../models/shop/CartItem"));
var Order_1 = __importDefault(require("../../models/shop/Order"));
var OrderItem_1 = __importDefault(require("../../models/shop/OrderItem"));
var Product_1 = __importDefault(require("../../models/shop/Product"));
var User_1 = __importDefault(require("../../models/shop/User"));
module.exports = /** @class */ (function (_super) {
    __extends(Shop, _super);
    function Shop() {
        var _this = _super.call(this) || this;
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
        _this.products = function () { return _this.route('get', '/products/', { userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_products;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                user_products = req.getCurrentUser() ? req.getCurrentUser().getProducts() : false;
                if (typeof user_products === 'object') {
                    user_products
                        .then(function (rows) {
                        var paginator = Singleton_1.Singleton.getPagination().getRecords(req, rows, 12);
                        var records = paginator[0], current_page = paginator[1], pages = paginator[2], _paginator = paginator[3];
                        return _this.render(res, 'shop/product-list', {
                            products: records,
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
                            ],
                            current_page: current_page,
                            pages: pages,
                            _paginator: _paginator
                        });
                    })
                        .catch(function (err) { return _this.onError(res, next, err); });
                }
                else {
                    return [2 /*return*/, res.render('shop/product-list', {
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
                        })];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function index
         * @description index route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.index = function () { return _this.route('get', '/', { userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_products;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                user_products = req.getCurrentUser() ? req.getCurrentUser().getProducts() : false;
                if (typeof user_products === 'object') {
                    user_products
                        .then(function (rows) {
                        var paginator = Singleton_1.Singleton.getPagination().getRecords(req, rows, 12);
                        var records = paginator[0], current_page = paginator[1], pages = paginator[2], _paginator = paginator[3];
                        return _this.render(res, 'shop/index', {
                            products: records || [],
                            nav_title: 'shop',
                            path: '/',
                            root: 'shop',
                            breadcrumbs: [
                                {
                                    title: 'Shop',
                                    url: '/'
                                }
                            ],
                            pages: pages,
                            current_page: current_page,
                            _paginator: _paginator
                        });
                    })
                        .catch(function (err) { return _this.onError(res, next, err); });
                }
                else {
                    return [2 /*return*/, this.render(res, 'shop/index', {
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
                        })];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function cart
         * @description cart route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.cart = function () { return _this.route('get', '/cart/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_cart;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                res.removeHeader("Cross-Origin-Resource-Policy");
                res.removeHeader("Cross-Origin-Embedder-Policy");
                user_cart = req.getCurrentUser().getCart() || [];
                if (!user_cart) {
                    return [2 /*return*/, this.onError(res, next, new Error('User is not available'))];
                }
                user_cart
                    .then(function (rows) {
                    if (rows) {
                        if (typeof rows['getProducts'] !== 'undefined') {
                            rows['getProducts']
                                .then(function (cart_products) {
                                if (cart_products['getProducts'].length > 0) {
                                    cart_products = cart_products['getProducts'];
                                    if (!_this.__.isEmpty(cart_products)) {
                                        var where_clause_1;
                                        cart_products.forEach(function (cart_product, index) {
                                            if (index > 0) {
                                                where_clause_1 = where_clause_1 + ' or id = ' + cart_products[index].product_id;
                                            }
                                            else {
                                                where_clause_1 = 'id = ' + cart_products[index].product_id;
                                            }
                                        });
                                        _this.product.filter(where_clause_1)
                                            .then(function (rows) {
                                            cart_products.forEach(function (cart_product, index) {
                                                rows.forEach(function (_row, row_index) {
                                                    if (_row.id === cart_product.product_id) {
                                                        cart_product['title'] = _row.title;
                                                        cart_product['description'] = _row.description;
                                                        cart_product['imageUrl'] = _row.imageUrl;
                                                        cart_product['product_id'] = _row.id;
                                                        cart_product['price'] = _row.price;
                                                    }
                                                });
                                            });
                                            return { session: (function () { return __awaiter(_this, void 0, void 0, function () {
                                                    var stripe;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                stripe = require('stripe')('sk_test_51LwhSpHh4oQqwjTUy0a2jgwphD8CTgb8czMsySR79Jbqfwjm2M819AO3ydmvQfybePlZixdlFl0fE0ur40UE3xMw00Uinv9DFm');
                                                                return [4 /*yield*/, stripe.checkout.sessions.create({
                                                                        payment_method_types: ['card'],
                                                                        mode: 'payment',
                                                                        customer_email: req.getCurrentUser().email,
                                                                        client_reference_id: req.getCurrentUser().id,
                                                                        currency: 'EUR',
                                                                        locale: 'de',
                                                                        success_url: req.protocol + '://' + req.get('host') + '/orders/',
                                                                        cancel_url: req.protocol + '://' + req.get('host') + '/cart/',
                                                                        line_items: cart_products.map(function (p) {
                                                                            return {
                                                                                price: 'price_1LwipAHh4oQqwjTUYJe9dDc6',
                                                                                quantity: p.quantity,
                                                                            };
                                                                        }),
                                                                    })];
                                                            case 1: return [2 /*return*/, _a.sent()];
                                                        }
                                                    });
                                                }); }), cart_products: cart_products };
                                        })
                                            .then(function (data) {
                                            return _this.render(res, 'shop/cart', {
                                                nav_title: 'My Cart',
                                                path: '/cart/',
                                                products: data.cart_products,
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
                                                ],
                                                session_id: data.session().id
                                            });
                                        })
                                            .catch(function (err) { return _this.onError(res, next, err); });
                                    }
                                }
                                else {
                                    // return this.redirect(res, '/', this.constants.HTTPS_STATUS.REDIRECTION.SEE_OTHER);
                                    return _this.render(res, 'shop/cart', {
                                        nav_title: 'My Cart',
                                        path: '/cart/',
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
                                    });
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                        else {
                            return _this.render(res, 'shop/cart', {
                                nav_title: 'My Cart',
                                path: '/cart/',
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
                            });
                        }
                    }
                    else {
                        return _this.render(res, 'shop/cart', {
                            nav_title: 'My Cart',
                            path: '/cart/',
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
                        });
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postCart
         * @description postCart route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postCart = function () { return _this.route('post', '/cart/', _this.cartMiddlewares(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors, product_id, user_id;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                errors = (0, express_validator_1.validationResult)(req);
                product_id = req.getFormPostedData('product_id') || '';
                user_id = req.getCurrentUser().id;
                if (errors.isEmpty()) {
                    // @ts-ignore 
                    this.cart_object.get({ user_id: user_id }).then(function (rows) {
                        if (!_this.__.isEmpty(rows)) {
                            var cart_id_1 = rows[0].id;
                            _this.cart_items_object.filter({ cart_id: cart_id_1, product_id: product_id })
                                // @ts-ignore 
                                .then(function (cart_items_rows) {
                                if (typeof cart_items_rows !== 'undefined') {
                                    var quantity = cart_items_rows[0].quantity + 1;
                                    var id = cart_items_rows[0].id;
                                    // @ts-ignore 
                                    _this.cart_items_object.update({ quantity: quantity }, id).then((function (check) {
                                        if (check) {
                                            return _this.redirect(res, '/cart/');
                                        }
                                    }))
                                        .catch(function (err) { return _this.onError(res, next, err); });
                                }
                                else {
                                    var cart_item_params = {
                                        cart_id: +cart_id_1,
                                        product_id: +product_id,
                                        quantity: 1
                                    };
                                    _this.cart_items_object.create(cart_item_params)
                                        // @ts-ignore 
                                        .then(function (cart_item_element) {
                                        if (cart_item_element) {
                                            return _this.redirect(res, '/cart/');
                                        }
                                    })
                                        .catch(function (err) { return _this.onError(res, next, err); });
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                        else {
                            var cart_params = {
                                user_id: user_id
                            };
                            _this.cart_object.create(cart_params)
                                // @ts-ignore 
                                .then(function (cart_element) {
                                var id = cart_element[0].insertId;
                                if (id) {
                                    _this.cart_items_object.filter({ cart_id: id, product_id: product_id })
                                        // @ts-ignore 
                                        .then(function (cart_items_rows) {
                                        if (typeof cart_items_rows !== 'undefined') {
                                            var quantity = cart_items_rows[0].quantity + 1;
                                            var id_1 = cart_items_rows[0].id;
                                            _this.cart_items_object.update({ quantity: quantity }, id_1)
                                                // @ts-ignore 
                                                .then((function (check) {
                                                if (check) {
                                                    return _this.redirect(res, '/cart/');
                                                }
                                            }))
                                                .catch(function (err) { return _this.onError(res, next, err); });
                                        }
                                        else {
                                            var cart_item_params = {
                                                cart_id: +id,
                                                product_id: +product_id,
                                                quantity: 1
                                            };
                                            _this.cart_items_object.create(cart_item_params)
                                                // @ts-ignore 
                                                .then(function (cart_item_element) {
                                                if (cart_item_element) {
                                                    return _this.redirect(res, '/cart/');
                                                }
                                            })
                                                .catch(function (err) { return _this.onError(res, next, err); });
                                        }
                                    })
                                        .catch(function (err) { return _this.onError(res, next, err); });
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                    }).catch(function (err) { return _this.onError(res, next, err); });
                }
                else {
                    return [2 /*return*/, this.onErrorValidation(res, errors.array())];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function getCheckout
         * @description checkout route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getCheckout = function () { return _this.route('get', '/checkout/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                return [2 /*return*/, this.render(res, 'shop/checkout', {
                        nav_title: 'Checkout',
                        path: '/checkout/'
                    })];
            });
        }); }); };
        /**
         * @function postCheckout
         * @description post checkout route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postCheckout = function () { return _this.route('post', '/checkout/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                return [2 /*return*/, this.render(res, 'shop/checkout', {
                        nav_title: 'Checkout',
                        path: '/checkout/'
                    })];
            });
        }); }); };
        /**
         * @function orders
         * @description orders route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.orders = function () { return _this.route('get', '/orders/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                req.getCurrentUser().getOrder().then(function (order) {
                    if (typeof order === 'undefined') {
                        return _this.redirect(res, '/cart');
                    }
                    if (order.hasOwnProperty('getProducts')) {
                        order.getProducts
                            .then(function (ordered_products) {
                            if (!_this.__.isEmpty(ordered_products.getProducts)) {
                                var where_clause_2;
                                ordered_products.getProducts.forEach(function (product, index) {
                                    if (index > 0) {
                                        where_clause_2 = where_clause_2 + ' or id = ' + ordered_products.getProducts[index].product_id;
                                    }
                                    else {
                                        where_clause_2 = 'id = ' + ordered_products.getProducts[index].product_id;
                                    }
                                });
                                _this.product.filter(where_clause_2)
                                    .then(function (_products) {
                                    ordered_products.getProducts.forEach(function (element, index) {
                                        _products.forEach(function (_product, _index) {
                                            if (+_product.id === +element.product_id) {
                                                ordered_products.getProducts[index].title = _products[_index].title;
                                                ordered_products.getProducts[index].description = _products[_index].description;
                                                ordered_products.getProducts[index].price = _products[_index].price;
                                                ordered_products.getProducts[index].imageUrl = _products[_index].imageUrl;
                                            }
                                        });
                                    });
                                    return _this.render(res, 'shop/orders', {
                                        nav_title: 'My Orders',
                                        path: '/orders/',
                                        orders: ordered_products.getProducts,
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
                                                url: "/orders/"
                                            }
                                        ]
                                    });
                                })
                                    .catch(function (err) { return _this.onError(res, next, err); });
                            }
                            else {
                                return _this.redirect(res, '/cart');
                            }
                        })
                            .catch(function (err) { return _this.onError(res, next, err); });
                    }
                    else {
                        return _this.redirect(res, '/cart');
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postOrders
         * @description postOrders route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postOrders = function () { return _this.route('post', '/create-order/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user_id;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                user_id = req.getCurrentUser().id;
                req.getCurrentUser().getCart().then(function (cart) {
                    if (cart) {
                        if (cart['getProducts']) {
                            return cart['getProducts'].then(function (product) {
                                if (product) {
                                    return product.getProducts;
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                    }
                })
                    .then(function (products) {
                    if (products) {
                        _this.order_object.get({ user_id: user_id }).then(function (rows) {
                            if (!_this.__.isEmpty(rows)) {
                                var order_id_1 = rows[0].id;
                                products.forEach(function (product) {
                                    if (product) {
                                        _this.cart_items_object.delete(product.id);
                                        _this.order_items_object.filter({ order_id: order_id_1, product_id: product.product_id })
                                            .then(function (order_items_rows) {
                                            if (typeof order_items_rows === 'undefined') {
                                                var order_item_params = {
                                                    order_id: +order_id_1,
                                                    product_id: +product.product_id,
                                                    quantity: product.quantity
                                                };
                                                _this.order_items_object.create(order_item_params).then(function (order_item_element) {
                                                    if (order_item_element) {
                                                        if (!res.headersSent) {
                                                            return _this.redirect(res, '/orders/');
                                                        }
                                                    }
                                                })
                                                    .catch(function (err) { return _this.onError(res, next, err); });
                                            }
                                            else if (typeof order_items_rows !== 'undefined') {
                                                order_items_rows.forEach(function (order_items_row) {
                                                    _this.order_items_object.filter({ id: order_items_row.id })
                                                        .then(function (item) {
                                                        var order_item_id = item[0].id;
                                                        var order_item_params = {
                                                            order_id: +order_id_1,
                                                            product_id: +product.product_id,
                                                            quantity: product.quantity
                                                        };
                                                        _this.order_items_object.update(order_item_params, order_item_id)
                                                            .then(function (order_item_element) {
                                                            if (order_item_element) {
                                                                if (!res.headersSent) {
                                                                    return _this.redirect(res, '/orders/');
                                                                }
                                                            }
                                                        })
                                                            .catch(function (err) { return _this.onError(res, next, err); });
                                                    })
                                                        .catch(function (err) { return _this.onError(res, next, err); });
                                                });
                                            }
                                        })
                                            .catch(function (err) { return _this.onError(res, next, err); });
                                    }
                                });
                            }
                            else {
                                var order_params = {
                                    user_id: user_id
                                };
                                _this.order_object.create(order_params)
                                    .then(function (order_element) {
                                    var id = order_element[0].insertId;
                                    if (id) {
                                        products.forEach(function (product) {
                                            if (product) {
                                                _this.cart_items_object.delete(product.id);
                                                _this.order_items_object.filter({ order_id: id, product_id: product.product_id })
                                                    .then(function (order_items_rows) {
                                                    if (typeof order_items_rows === 'undefined') {
                                                        var order_item_params = {
                                                            order_id: +id,
                                                            product_id: +product.product_id,
                                                            quantity: product.quantity
                                                        };
                                                        _this.order_items_object.create(order_item_params)
                                                            .then(function (order_item_element) {
                                                            if (order_item_element) {
                                                                if (!res.headersSent) {
                                                                    return _this.redirect(res, '/orders/');
                                                                }
                                                            }
                                                        })
                                                            .catch(function (err) { return _this.onError(res, next, err); });
                                                    }
                                                    if (!res.headersSent) {
                                                        return _this.redirect(res, '/orders/');
                                                    }
                                                })
                                                    .catch(function (err) { return _this.onError(res, next, err); });
                                            }
                                        });
                                    }
                                })
                                    .catch(function (err) { return _this.onError(res, next, err); });
                            }
                        })
                            .catch(function (err) { return _this.onError(res, next, err); });
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function dynProductInfo
         * @description dynProductInfo route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.dynProductInfo = function () { return _this.route('get', '/products/:productId/', { userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var product_id, user_id;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.updatedContentAlways();
                product_id = req.getDynamicParam('productId') || false;
                if (req.getCurrentUser()) {
                    user_id = +req.getCurrentUser().id || false;
                }
                if (!isNaN(product_id)) {
                    product_id = +product_id;
                    this.product.get({ id: product_id, user_id: user_id })
                        // @ts-ignore 
                        .then(function (rows) {
                        if (rows) {
                            var product = rows[0];
                            return _this.render(res, 'shop/product-detail', {
                                nav_title: product.title || 'Product Details',
                                path: '/products/',
                                product: product || []
                            });
                        }
                        else {
                            return _this.siteNotFound(res);
                        }
                    })
                        .catch(function (err) { return _this.onError(res, next, err); });
                }
                else {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function deleteCartProducts
         * @description deleteCartProducts route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.deleteCartProducts = function () { return _this.route('post', '/cart/delete-items/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var cart_item_product_id;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                cart_item_product_id = req.getFormPostedData('product_items_id') || false;
                if (cart_item_product_id) {
                    this.cart_items_object.get({ product_id: cart_item_product_id }).then(function (result) {
                        if (result) {
                            _this.cart_items_object.delete({ product_id: cart_item_product_id })
                                .then(function (result) {
                                if (result[0].affectedRows > 0) {
                                    _this.order_items_object.filter({ product_id: cart_item_product_id }).then(function (item) {
                                        if (typeof item !== 'undefined') {
                                            _this.order_items_object.delete({ product_id: cart_item_product_id })
                                                .then(function (_result) {
                                                if (_result[0].affectedRows > 0) {
                                                    return _this.redirect(res, '/cart/');
                                                }
                                            })
                                                .catch(function (err) { return _this.onError(res, next, err); });
                                        }
                                        else {
                                            return _this.redirect(res, '/cart/');
                                        }
                                    })
                                        .catch(function (err) { return _this.onError(res, next, err); });
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function deleteCartProduct
         * @description deleteCartProduct route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.deleteCartProduct = function () { return _this.route('post', '/cart/delete-item/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var cart_item_product_id;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                cart_item_product_id = req.getFormPostedData('product_id') || false;
                if (cart_item_product_id) {
                    this.cart_items_object.get({ product_id: cart_item_product_id }).then(function (result) {
                        if (result) {
                            if (+result[0].product_id === +cart_item_product_id && result[0].quantity > 1) {
                                _this.cart_items_object.update({ quantity: result[0].quantity - 1 }, result[0].id)
                                    .then(function (result) {
                                    if (result) {
                                        return _this.redirect(res, '/cart/');
                                    }
                                })
                                    .catch(function (err) { return _this.onError(res, next, err); });
                            }
                            else {
                                _this.cart_items_object.delete({ product_id: cart_item_product_id })
                                    .then(function (result) {
                                    if (result[0].affectedRows > 0) {
                                        return _this.redirect(res, '/cart/');
                                    }
                                })
                                    .catch(function (err) { return _this.onError(res, next, err); });
                            }
                        }
                    })
                        .catch(function (err) { return _this.onError(res, next, err); });
                }
                return [2 /*return*/];
            });
        }); }); };
        //*******************************\\
        //* Orders's invoice middleware *\\
        //*******************************\\
        _this.orderInvoice = function () { return ({
            isAuth: is_auth_1.default,
            userSession: init_user_session_1.default,
        }); };
        /**
         * @function getInvoice
         * @description Fetches the invoice on ordering a product
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getInvoice = function () { return _this.route('get', '/orders/invoice/:order_id/', _this.orderInvoice(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var order_id, user;
            var _this = this;
            return __generator(this, function (_a) {
                order_id = +req.getDynamicParam('order_id');
                user = req.getCurrentUser();
                if (!this.__.isNumber(order_id)) {
                    return [2 /*return*/, this.onError(res, next, 'Please do not alter the link!')];
                }
                if (Object.keys(user).length === 0 || this.__.isEmpty(user)) {
                    return [2 /*return*/, this.redirect(res, '/')];
                }
                this.order_items_object.get({ id: order_id })
                    .then(function (result) {
                    if (result) {
                        var quantity = +result[0].quantity;
                        if (typeof result['product_id'] !== 'undefined') {
                            result['product_id']
                                .then(function (_result) {
                                if (_result) {
                                    Singleton_1.Singleton.getModel('User').get({ id: user.id })
                                        .then(function (_user) {
                                        if (_user) {
                                            var condition = false;
                                            if (_result['order_products_items'] && user.id) {
                                                condition = _result['order_products_items'][0].user_id.toString() === user.id.toString();
                                            }
                                            if (condition) {
                                                var invoice = "invoice_".concat(order_id, ".pdf");
                                                var path = Singleton_1.Singleton.getPath().join(__dirname, '..', '..', 'public', 'data', 'invoices', invoice);
                                                var fs = Singleton_1.Singleton.getFileSystem();
                                                var price = +_result['order_products_items'][0].price;
                                                var total_price = price * quantity;
                                                if (fs.existsSync(path)) {
                                                    var file = fs.createReadStream(path);
                                                    return _this.sendPdf(res, file, invoice, false);
                                                }
                                                else {
                                                    var pdf = Singleton_1.Singleton.getPdfMaker();
                                                    pdf.pipe(fs.createWriteStream(path));
                                                    var header = {
                                                        align: 'center',
                                                        underline: true
                                                    };
                                                    var bullet_points = {
                                                        align: 'center',
                                                    };
                                                    pdf.fontSize(26).text('Test', header);
                                                    pdf.fontSize(14).text('-----------------------------', bullet_points);
                                                    pdf.fontSize(14).text(_result['order_products_items'][0].title +
                                                        ' - ' +
                                                        quantity +
                                                        'x' +
                                                        ' $' + price, bullet_points);
                                                    pdf.fontSize(14).text('-----------------------------', bullet_points);
                                                    pdf.fontSize(20).text('Total price: $' + total_price, bullet_points);
                                                    return _this.sendPdf(res, pdf, invoice, false);
                                                }
                                            }
                                            else {
                                                return _this.redirect(res, '/orders/');
                                            }
                                        }
                                    })
                                        .catch(function (err) { return _this.onError(res, next, err); });
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, err); });
                        }
                    }
                    else {
                        return _this.siteNotFound(res);
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        //**************************************************************************
        //* Process protected functions
        //**************************************************************************
        //******************************\\
        //* Cart            middleware *\\
        //******************************\\
        _this.cartMiddlewares = function () { return ({
            isAuth: is_auth_1.default,
            userSession: init_user_session_1.default,
            validate: (0, express_validator_1.check)('product_id').isNumeric().withMessage('Product id must be a number!').bail()
        }); };
        /**
        * ! DYNAMIC ROUTES MUST BE THE LAST INDEX OF THE METHODS ARRAY
        */
        _this.methods = [
            'index',
            'products',
            'cart',
            'getCheckout',
            'postCheckout',
            'orders',
            'postOrders',
            'postCart',
            'deleteCartProducts',
            'deleteCartProduct',
            'getInvoice',
            'dynProductInfo',
        ];
        _this.product = new Product_1.default();
        _this.cart_object = new Cart_1.default();
        _this.user = new User_1.default();
        _this.order_object = new Order_1.default();
        _this.cart_items_object = new CartItem_1.default();
        _this.order_items_object = new OrderItem_1.default();
        _this.csrfProtection = (0, csurf_1.default)({ cookie: true });
        return _this;
    }
    return Shop;
}(BaseController_1.default));

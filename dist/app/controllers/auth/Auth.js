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
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var express_validator_1 = require("express-validator");
var BaseController_1 = __importDefault(require("../../../core/controller/BaseController"));
var cryptr_1 = require("../../../core/utils/cryptr");
var init_user_session_1 = __importDefault(require("../../middlewares/init_user_session"));
var is_auth_1 = __importDefault(require("../../middlewares/is_auth"));
var SecurityQuestion_1 = __importDefault(require("../../models/shop/SecurityQuestion"));
var User_1 = __importDefault(require("../../models/shop/User"));
var UserSecurityQuestion_1 = __importDefault(require("../../models/shop/UserSecurityQuestion"));
module.exports = /** @class */ (function (_super) {
    __extends(Auth, _super);
    function Auth() {
        var _this = _super.call(this) || this;
        /**
         * @function getAuthenticate
         * @description Get authentication user
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getAuthenticate = function () { return _this.route('get', '/login/', _this.getAuthLoginMiddleware(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                res.globalPostFormData();
                if (!req.session.is_authenticated) {
                    return [2 /*return*/, this.render(res, 'shop/login', {
                            nav_title: 'Login',
                            path: '/login/',
                            root: 'account'
                        })];
                }
                else {
                    return [2 /*return*/, this.redirect(res, '/')];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postAuthenticate
         * @description Check user's authentication's infos
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postAuthenticate = function () { return _this.route('post', '/login/', _this.validatedLogin(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors, email, password, forgot_password;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                req.sendFormPostedData();
                errors = (0, express_validator_1.validationResult)(req);
                email = req.getFormPostedData('email');
                password = req.getFormPostedData('password');
                forgot_password = req.getFormPostedData('password_reset');
                if (!this.__.isEmpty(forgot_password)) {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                if (errors.isEmpty()) {
                    this.user.get({ email: email })
                        .then(function (rows) {
                        if (typeof rows === 'undefined' || rows == null || _this.__.isEmpty(rows) || rows.length === 0) {
                            req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                            return _this.redirect(res, '/login');
                        }
                        rows = rows[0];
                        if (rows) {
                            bcryptjs_1.default.compare(password, rows.password)
                                .then(function (do_match) {
                                if (do_match) {
                                    if (typeof rows !== 'undefined') {
                                        req.session.currentUser = rows;
                                        req.session.save(function (err) {
                                            if (err) {
                                                return _this.onError(res, err);
                                            }
                                            if (!res.headersSent) {
                                                req.session.is_authenticated = true;
                                                _this.user_security_questions.filter({ user_id: req.session.currentUser.id })
                                                    // @ts-ignore 
                                                    .then(function (result) {
                                                    if (typeof result !== 'undefined') {
                                                        if (result) {
                                                            var redirectionUrl = req.session.redirectUrl || '/';
                                                            return _this.redirect(res, redirectionUrl);
                                                        }
                                                    }
                                                    else {
                                                        req.setProp('warning', 'You have not submitted any security questions, Please choose and answer two security questions!');
                                                        return _this.redirect(res, '/security');
                                                    }
                                                })
                                                    .catch(function (err) { return _this.onError(res, err); });
                                            }
                                        });
                                    }
                                }
                                else {
                                    req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                                    return _this.redirect(res, '/login');
                                }
                            })
                                .catch(function (err) { return _this.onError(res, err); });
                        }
                        else {
                            req.setProp('error', 'Email or password are not correct!, Please insert a valid data or sign up!');
                            return _this.redirect(res, '/login');
                        }
                    })
                        .catch(function (err) { return _this.onError(res, err); });
                }
                else {
                    return [2 /*return*/, this.onErrorValidation(res, errors.array())];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function getAuthenticate
         * @description Get authentication user
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getSignUp = function () { return _this.route('get', '/signup/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                if (!req.session.is_authenticated) {
                    return [2 /*return*/, this.render(res, 'shop/signup', {
                            nav_title: 'Sign up',
                            path: '/signup/',
                            root: 'account'
                        })];
                }
                else {
                    return [2 /*return*/, this.redirect(res, '/')];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postSignUp
         * @description Check user's authentication's infos
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postSignUp = function () { return _this.route('post', '/signup/', _this.validatedSignUp(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var first_name, last_name, email, password, errors;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                req.sendFormPostedData();
                first_name = req.getFormPostedData('first_name');
                last_name = req.getFormPostedData('last_name');
                email = req.getFormPostedData('email');
                password = req.getFormPostedData('password');
                errors = (0, express_validator_1.validationResult)(req);
                if (errors.isEmpty()) {
                    this.user.filter({ first_name: first_name, last_name: last_name, email: email })
                        .then(function (rows) {
                        if (!rows) {
                            bcryptjs_1.default.hash(password, 12)
                                .then(function (hashed_password) {
                                _this.user.create({ first_name: first_name, last_name: last_name, email: email, password: hashed_password })
                                    .then(function (result) {
                                    if (result) {
                                        req.setProp('warning', 'Security questions are not provided yet!, please set two security questions!');
                                        return _this.redirect(res, '/security');
                                    }
                                })
                                    .catch(function (err) { return _this.onError(res, err); });
                            })
                                .catch(function (err) { return _this.onError(res, err); });
                        }
                        else {
                            req.setProp('error', 'Email is already registered!');
                            return _this.redirect(res, '/login');
                        }
                    })
                        .catch(function (err) { return _this.onError(res, err); });
                }
                else {
                    return [2 /*return*/, this.onErrorValidation(res, errors.array())];
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function logout
         * @description Log user out
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.logout = function () { return _this.route('post', '/logout/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.onLogOut(req.user_cookie);
                req.session.destroy(function (err) {
                    if (err) {
                        return _this.onError(res, err);
                    }
                    return _this.redirect(res, '/login');
                });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function reset
         * @description Reset on forgot password
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postReset = function () { return _this.route('post', '/reset/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var email;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                email = req.getFormPostedData('email');
                if (this.__.isEmpty(email)) {
                    req.setProp('warning', 'Please insert your email!');
                    return [2 /*return*/, this.postToSameSite(res)];
                }
                this.user.get({ email: email })
                    // @ts-ignore 
                    .then(function (result) {
                    if (typeof result !== 'undefined') {
                        if (result) {
                            req.setProp('recover_email', email.toString());
                            req.setProp('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!');
                            return _this.redirect(res, '/password_recovery/');
                        }
                    }
                    else {
                        return _this.redirect(res, '/reset');
                    }
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function reset
         * @description Reset on forgot password
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getReset = function () { return _this.route('get', '/reset/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.isGet()) {
                    res.noCacheNeeded();
                    return [2 /*return*/, this.render(res, 'shop/reset', {
                            nav_title: 'Reset Password',
                            path: '/reset/'
                        })];
                }
                return [2 /*return*/, this.siteNotFound(res)];
            });
        }); }); };
        /**
         * @function getRecoverPassword
         * @description Lets the user choose security questions
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getRecoverPassword = function () { return _this.route('get', '/password_recovery/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var email, params, first_question, second_question, first_answer, second_answer;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                email = req.props()['recover_email'];
                if (typeof email === 'undefined') {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                email = email[0];
                params = res.globalPostFormData();
                first_question = null;
                second_question = null;
                first_answer = null;
                second_answer = null;
                if (Object.keys(params).length > 0) {
                    first_question = typeof params.security_questions !== 'undefined' ? params.security_questions[0] ? params.security_questions[0] : '' : '';
                    second_question = typeof params.security_questions !== 'undefined' ? params.security_questions[1] ? params.security_questions[1] : '' : '';
                    first_answer = params.first_answer ? params.first_answer : '';
                    second_answer = params.second_answer ? params.second_answer : '';
                }
                this.security_questions
                    .filter()
                    // @ts-ignore 
                    .then(function (questions) {
                    if (typeof questions !== 'undefined') {
                        return questions;
                    }
                })
                    .then(function (questions) {
                    return _this.render(res, 'shop/password_recovery', {
                        nav_title: 'Security Questions',
                        path: '/security/',
                        questions: questions,
                        first_question: first_question ? questions[first_question - 1].question : '',
                        first_question_id: first_question ? questions[first_question - 1].id : '',
                        second_question: second_question ? questions[second_question - 1].question : '',
                        second_question_id: second_question ? questions[second_question - 1].id : '',
                        first_answer: first_answer || '',
                        second_answer: second_answer || '',
                        email: email
                    });
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function getRecoverPassword
         * @description Lets the user choose security questions
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postRecoverPassword = function () { return _this.route('post', '/password_recovery/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var email, _a, first_question, second_question, first_answer, second_answer;
            var _this = this;
            return __generator(this, function (_b) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                email = req.getFormPostedData('email');
                if (typeof email === 'undefined') {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                if (typeof req.getFormPostedData('security_questions') !== 'object'
                    || this.__.isEmpty(req.getFormPostedData('first_answer'))
                    || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
                    req.setProp('warning', 'Please choose and answer the questions that you have submitted in order to recover your email!');
                    req.setProp('post_data', req.getAllFormPostedData());
                    req.setProp('recover_email', email);
                    return [2 /*return*/, this.postToSameSite(res)];
                }
                _a = req.getFormPostedData('security_questions'), first_question = _a[0], second_question = _a[1];
                first_answer = req.getFormPostedData('first_answer');
                second_answer = req.getFormPostedData('second_answer');
                this.security_questions
                    .filter()
                    .then(function (questions) {
                    if (typeof questions !== 'undefined') {
                        return questions;
                    }
                })
                    .then(function (questions) {
                    _this.user.filter({ email: email })
                        .then(function (result) {
                        if (result) {
                            result = result[0];
                            _this.user_security_questions.filter({ user_id: result.id })
                                .then(function (result) {
                                if (result) {
                                    var _first_result = result[0];
                                    var _first_answer = (0, cryptr_1.decrypt)(_first_result.answer);
                                    var _second_result = result[1];
                                    var _second_answer = (0, cryptr_1.decrypt)(_second_result.answer);
                                    if (_first_answer === first_answer
                                        && _second_answer === second_answer) {
                                        req.setProp('password_reset_acces', 'granted');
                                        req.setProp('warning', 'Please enter and confirm your new password');
                                        req.setProp('email', email);
                                        return _this.redirect(res, '/password_reset');
                                    }
                                    else {
                                        req.setProp('warning', 'You have choose or answered the wrong question!, please try again or contact us!');
                                        req.setProp('post_data', req.getAllFormPostedData());
                                        req.setProp('recover_email', email);
                                        return _this.postToSameSite(res);
                                    }
                                }
                                else {
                                    return _this.redirect(res, '/signup');
                                }
                            })
                                .catch(function (err) { return _this.onError(res, err); });
                        }
                        else {
                            return _this.redirect(res, '/signup');
                        }
                    })
                        .catch(function (err) { return _this.onError(res, err); });
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function getSecurityQuestions
         * @description Lets the user choose security questions
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getSecurityQuestions = function () { return _this.route('get', '/security/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var params, first_question, second_question, first_answer, second_answer;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                params = res.globalPostFormData();
                first_question = null;
                second_question = null;
                first_answer = null;
                second_answer = null;
                if (Object.keys(params).length > 0) {
                    first_question = params['security_questions'] ? params.security_questions[0] ? params.security_questions[0] : '' : '';
                    second_question = params['security_questions'] ? params.security_questions[1] ? params.security_questions[1] : '' : '';
                    first_answer = params['first_answer'] ? params.first_answer ? params.first_answer : '' : '';
                    second_answer = params['second_answer'] ? params.second_answer ? params.second_answer : '' : '';
                    this.security_questions
                        .filter()
                        .then(function (questions) {
                        if (typeof questions !== 'undefined') {
                            return questions;
                        }
                    })
                        .then(function (questions) {
                        return _this.render(res, 'shop/security', {
                            nav_title: 'Security Questions',
                            path: '/security/',
                            questions: questions,
                            first_question: first_question ? questions[first_question - 1].question : '',
                            first_question_id: first_question ? questions[first_question - 1].id : '',
                            second_question: second_question ? questions[second_question - 1].question : '',
                            second_question_id: second_question ? questions[second_question - 1].id : '',
                            first_answer: first_answer || '',
                            second_answer: second_answer || ''
                        });
                    })
                        .catch(function (err) { return _this.onError(res, err); });
                }
                else {
                    this.user_security_questions.filter({ user_id: req.getCurrentUser().id })
                        .then(function (result) {
                        if (result) {
                            first_question = result[0].question;
                            first_answer = (0, cryptr_1.decrypt)(result[0].answer);
                            second_question = result[1].question;
                            second_answer = (0, cryptr_1.decrypt)(result[1].answer);
                            var questions = [];
                            _this.security_questions
                                .filter()
                                .then(function (questions) {
                                if (typeof questions !== 'undefined') {
                                    return _this.render(res, 'shop/security', {
                                        nav_title: 'Security Questions',
                                        path: '/security/',
                                        questions: questions,
                                        first_question: first_question ? questions[first_question - 1].question : '',
                                        first_question_id: first_question ? questions[first_question - 1].id : '',
                                        second_question: second_question ? questions[second_question - 1].question : '',
                                        second_question_id: second_question ? questions[second_question - 1].id : '',
                                        first_answer: first_answer || '',
                                        second_answer: second_answer || ''
                                    });
                                }
                            }).catch(function (err) { return _this.onError(res, err); });
                        }
                        else {
                            _this.security_questions
                                .filter()
                                .then(function (questions) {
                                if (typeof questions !== 'undefined') {
                                    return questions;
                                }
                            })
                                .then(function (questions) {
                                return _this.render(res, 'shop/security', {
                                    nav_title: 'Security Questions',
                                    path: '/security/',
                                    questions: questions,
                                    first_question: first_question ? questions[first_question - 1].question : '',
                                    first_question_id: first_question ? questions[first_question - 1].id : '',
                                    second_question: second_question ? questions[second_question - 1].question : '',
                                    second_question_id: second_question ? questions[second_question - 1].id : '',
                                    first_answer: first_answer || '',
                                    second_answer: second_answer || ''
                                });
                            })
                                .catch(function (err) { return _this.onError(res, err); });
                        }
                    })
                        .catch(function (err) { return _this.onError(res, err); });
                }
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function postSecurityQuestions
         * @description Lets the user sets security questions
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postSecurityQuestions = function () { return _this.route('post', '/security/', { isAuth: is_auth_1.default, userSession: init_user_session_1.default }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, first_question, second_question, first_answer, second_answer;
            var _this = this;
            return __generator(this, function (_b) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                if (typeof req.getFormPostedData('security_questions') !== 'object'
                    || this.__.isEmpty(req.getFormPostedData('first_answer'))
                    || this.__.isEmpty(req.getFormPostedData('second_answer'))) {
                    req.setProp('warning', 'Please choose and answer two security questions!');
                    // will be triggered through the following function call
                    req.sendFormPostedData();
                    // req.setProp('post_data', req.getAllFormPostedData());
                    return [2 /*return*/, this.redirect(res, '/security')];
                }
                _a = req.getFormPostedData('security_questions'), first_question = _a[0], second_question = _a[1];
                first_answer = req.getFormPostedData('first_answer');
                second_answer = req.getFormPostedData('second_answer');
                this.user_security_questions.create({
                    user_id: req.getCurrentUser().id,
                    question: first_question,
                    answer: (0, cryptr_1.encrypt)(first_answer)
                }).then(function (result) {
                    if (result) {
                        _this.user_security_questions.create({
                            user_id: req.getCurrentUser().id,
                            question: second_question,
                            answer: (0, cryptr_1.encrypt)(second_answer)
                            // @ts-ignore 
                        }).then(function (_result) {
                            if (_result) {
                                req.setProp('Success', 'Your account is not secured, you may proceed!');
                                return _this.redirect(res, '/');
                            }
                        })
                            .catch(function (err) { return _this.onError(res, err); });
                        ;
                    }
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function getPasswordReset
         * @description Allows the user to reset the password
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.getPasswordReset = function () { return _this.route('get', '/password_reset/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var is_allowed, email;
            return __generator(this, function (_a) {
                if (!req.isGet()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                res.noCacheNeeded();
                is_allowed = req.props()['password_reset_acces'];
                email = req.props()['email'];
                if (typeof is_allowed === 'undefined' || typeof email === 'undefined') {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                if (is_allowed[0] !== 'granted') {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                return [2 /*return*/, this.render(res, 'shop/password_reset', {
                        nav_title: 'Reset Password',
                        path: '/password_reset/',
                        email: email
                    })];
            });
        }); }); };
        /**
         * @function getPasswordReset
         * @description Allows the user to reset the password
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.postPasswordReset = function () { return _this.route('post', '/password_reset/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var email, password, confirm_password;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                email = req.getFormPostedData('email');
                if (typeof email === 'undefined') {
                    return [2 /*return*/, this.redirect(res, '/reset')];
                }
                password = req.getFormPostedData('password');
                confirm_password = req.getFormPostedData('confirm_password');
                if (this.__.isEmpty(password) || this.__.isEmpty(confirm_password)) {
                    req.setProp('warning', 'Please enter and confirm your password!');
                    req.setProp('password_reset_acces', 'granted');
                    req.setProp('email', email);
                    return [2 /*return*/, this.postToSameSite(res)];
                }
                if (confirm_password !== password) {
                    req.setProp('error', 'Passwords do not match!');
                    req.setProp('password_reset_acces', 'granted');
                    req.setProp('email', email);
                    return [2 /*return*/, this.postToSameSite(res)];
                }
                this.user.filter({ email: email })
                    // @ts-ignore 
                    .then(function (rows) {
                    if (rows) {
                        rows = rows[0];
                        bcryptjs_1.default.hash(password, 12)
                            .then(function (hashed_password) {
                            // @ts-ignore 
                            _this.user.update({ password: hashed_password }, { id: rows.id })
                                // @ts-ignore 
                                .then(function (result) {
                                if (result) {
                                    req.setProp('success', 'Your password has been updated!');
                                    return _this.redirect(res, '/login');
                                }
                            })
                                .catch(function (err) { return _this.onError(res, err); });
                        })
                            .catch(function (err) { return _this.onError(res, err); });
                    }
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        //**************************************************************************
        //* Process protected functions
        //**************************************************************************
        //******************************\\
        //* Auth middleware            *\\
        //******************************\\
        _this.getAuthLoginMiddleware = function () { return ({
            cors: _this.express.express_cors(_this.corsOptionsDelegate)
        }); };
        //******************************\\
        //* Sign up middleware         *\\
        //******************************\\
        _this.validatedSignUp = function () { return ({
            validate_first_name: (0, express_validator_1.check)('first_name').not().isEmpty().withMessage('Please enter your firstname!').bail(),
            validate_last_name: (0, express_validator_1.check)('last_name').not().isEmpty().withMessage('Please enter your lastname!').bail(),
            validate_email: (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email!').bail(),
            validate_password: (0, express_validator_1.check)('password')
                .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 1
            })
                .withMessage("Please enter a password with minimum length of 8\n                                        , one lower case character\n                                        , one upper case character\n                                        , one symbol\n                                        and one number")
                .bail(),
            validate_confirm_password: (0, express_validator_1.check)('confirm_password').custom(function (value, _a) {
                var req = _a.req;
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password!');
                }
                return true;
            }).withMessage('Password confirmation does not match password!').bail()
        }); };
        //******************************\\
        //* Sign in middleware         *\\
        //******************************\\
        _this.validatedLogin = function () { return ({
            validate_email: (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid email!').bail(),
            validate_password: (0, express_validator_1.check)('password').not().isEmpty().withMessage('Please enter your password!').bail()
        }); };
        _this.methods = [
            'getAuthenticate',
            'postAuthenticate',
            'getSignUp',
            'postSignUp',
            'logout',
            'postReset',
            'getReset',
            'getSecurityQuestions',
            'postSecurityQuestions',
            'getRecoverPassword',
            'postRecoverPassword',
            'getPasswordReset',
            'postPasswordReset'
        ];
        _this.user = new User_1.default();
        _this.security_questions = new SecurityQuestion_1.default();
        _this.user_security_questions = new UserSecurityQuestion_1.default();
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
    return Auth;
}(BaseController_1.default));

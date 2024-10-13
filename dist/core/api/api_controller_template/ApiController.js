"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var JsonResponse_1 = __importDefault(require("../../../core/response/types/JsonResponse"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var express_validator_1 = require("express-validator");
var User_1 = __importDefault(require("../../../app/models/shop/User"));
var UserSecurityQuestion_1 = __importDefault(require("../../../app/models/shop/UserSecurityQuestion"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config = __importStar(require("../../../core/config"));
var Api_1 = __importDefault(require("../../../core/api/Api"));
var Error_1 = __importDefault(require("../../error/types/Error"));
module.exports = /** @class */ (function (_super) {
    __extends(ApiControllerNameWillBeUpdatedAutomatically, _super);
    function ApiControllerNameWillBeUpdatedAutomatically() {
        var _this = _super.call(this) || this;
        //**********\\
        //* Routes *\\
        //**********\\
        /**
         * @function getExmaple
         * @description getExmaple route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.getExmaple = function () {
            return _this.route("get", "/get_example", { is_logged_in: _this.isApiUserLoggedIn }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.onError(res, next, "declined api endpoint get apiController")];
                });
            }); });
        };
        /**
         * @function postExmaple
         * @description postExmaple route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.postExmaple = function () {
            return _this.route("post", "/post_example", { is_logged_in: _this.isApiUserLoggedIn }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new JsonResponse_1.default(201, "Success posted", { success: "OK", id: new Date() }).sendAsJson(res)];
                });
            }); });
        };
        /**
         * @function patchExmaple
         * @description patchExmaple route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.patchExmaple = function () {
            return _this.route("patch", "/patch_example", { is_logged_in: _this.isApiUserLoggedIn }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new JsonResponse_1.default(201, "Success patched", {
                            success: "OK",
                            origin: req.origin,
                            user_infos: req.user,
                            uid: new Date()
                        }).sendAsJson(res)];
                });
            }); });
        };
        /**
         * @function putExmaple
         * @description putExmaple route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.putExmaple = function () {
            return _this.route("put", "/put_example", { is_logged_in: _this.isApiUserLoggedIn }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new JsonResponse_1.default(201, "Success put", { success: "OK", id: new Date() }).sendAsJson(res)];
                });
            }); });
        };
        /**
         * @function deleteExmaple
         * @description deleteExmaple route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.deleteExmaple = function () {
            return _this.route("delete", "/delete_example", { is_logged_in: _this.isApiUserLoggedIn }, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new JsonResponse_1.default(200, "Success deleted", { success: "OK", id: new Date() }).sendAsJson(res)];
                });
            }); });
        };
        /**
         * @function postAuthenticate
         * @description Check user's authentication's infos
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
         */
        _this.postAuthenticate = function () {
            return _this.route("post", "/api-login", _this.validatedLogin(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var errors, email, password;
                var _this = this;
                return __generator(this, function (_a) {
                    errors = (0, express_validator_1.validationResult)(req);
                    email = req.getFormPostedData("email");
                    password = req.getFormPostedData("password");
                    if (errors.isEmpty()) {
                        this.user
                            .get({ email: email })
                            .then(function (rows) {
                            if (typeof rows === "undefined" ||
                                rows == null ||
                                _this._.isEmpty(rows) ||
                                rows.length === 0) {
                                return new JsonResponse_1.default(_this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED, "Email or password are not correct!, Please insert a valid E-mail address or sign up!", { status_code: _this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED }).sendAsJson(res);
                            }
                            rows = rows[0];
                            bcryptjs_1.default
                                .compare(password, rows.password)
                                .then(function (do_match) {
                                if (do_match) {
                                    if (typeof rows !== "undefined") {
                                        var token = jsonwebtoken_1.default.sign({ user: rows }, config.configurations().apiAuthenticationSecret, { expiresIn: "1h" });
                                        return new JsonResponse_1.default(_this.constants.HTTPS_STATUS.SUCCESS.OK, "Logged in", {
                                            success: "OK",
                                            status_code: _this.constants.HTTPS_STATUS.SUCCESS.OK,
                                            token: token
                                        }).sendAsJson(res);
                                    }
                                }
                                else {
                                    return new JsonResponse_1.default(_this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED, "Email or password are not correct!, Please insert a valid data or sign up!", { status_code: _this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED }).sendAsJson(res);
                                }
                            })
                                .catch(function (err) { return _this.onError(res, next, new Error_1.default(JSON.stringify(err))); });
                        })
                            .catch(function (err) { return _this.onError(res, next, new Error_1.default(JSON.stringify(err))); });
                    }
                    else {
                        return [2 /*return*/, new JsonResponse_1.default(this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNPROCESSABLE_ENTITY, "Invalid Email-Address or wrong password!", {
                                message: JSON.stringify(errors.array()) || errors.array().toString(),
                                status_code: this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNPROCESSABLE_ENTITY
                            }).sendAsJson(res)];
                    }
                    return [2 /*return*/];
                });
            }); });
        };
        //******************************\\
        //* Sign in middleware         *\\
        //******************************\\
        _this.validatedLogin = function () { return ({
            validate_email: (0, express_validator_1.check)("email").isEmail().withMessage("Please enter a valid email!").bail(),
            validate_password: (0, express_validator_1.check)("password").not().isEmpty().withMessage("Please enter your password!").bail()
        }); };
        //******************************\\
        //* Sign in middleware         *\\
        //******************************\\
        _this.isApiUserLoggedIn = function (req, res, next) {
            var AUTHORIZATION_HEADER = req.get("Authorization");
            if (!AUTHORIZATION_HEADER) {
                var _error = new Error_1.default("Not Authenticated!");
                //@ts-ignore
                _error.statusCode = _this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED;
                throw _error;
            }
            var TOKEN = AUTHORIZATION_HEADER.split(" ")[1];
            if (TOKEN) {
                var decoded_token = void 0;
                try {
                    decoded_token = jsonwebtoken_1.default.verify(TOKEN, config.configurations().apiAuthenticationSecret);
                }
                catch (error) {
                    // @ts-ignore
                    error.statusCode = _this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED;
                    // @ts-ignore
                    error.message = "Invalid authorization header token!";
                    throw error;
                }
                if (!decoded_token) {
                    var _error = new Error_1.default("Not Authenticated!");
                    //@ts-ignore
                    _error.statusCode = _this.constants.HTTPS_STATUS.CLIENT_ERRORS.UNAUTHORIZED;
                    throw _error;
                }
                req.user = decoded_token.user;
                return next();
            }
        };
        //? ************************************************************** ?\\
        //? this.method is used to deploy all the routes to express router ?\\
        //! dynamic routes must be the last index of the methods array     !\\
        //? ************************************************************** ?\\
        _this.methods = [
            //**********\\
            //* Routes *\\
            //**********\\
            "getExmaple",
            "postExmaple",
            "patchExmaple",
            "putExmaple",
            "deleteExmaple",
            "postAuthenticate"
            //******************\\
            //* DYNAMIC Routes *\\
            //******************\\
        ];
        //***************\\
        //* INIT MODELS *\\
        //***************\\
        _this.user = new User_1.default();
        _this.user_security_questions = new UserSecurityQuestion_1.default();
        return _this;
        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
    }
    return ApiControllerNameWillBeUpdatedAutomatically;
}(Api_1.default));

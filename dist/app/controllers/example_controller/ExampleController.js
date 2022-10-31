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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseController_1 = __importDefault(require("../../../core/controller/BaseController"));
var ExampleModel_1 = __importDefault(require("../../models/example_model/ExampleModel"));
var express_validator_1 = require("express-validator"); //? EXPRESS VALIDATOR ?\\
module.exports = /** @class */ (function (_super) {
    __extends(ExampleController, _super);
    function ExampleController() {
        var _this = _super.call(this) || this;
        //**********\\
        //* Routes *\\
        //**********\\
        /**
         * @function firstMethod
         * @description firstMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.firstMethod = function () { return _this.route('get', '/get_exmaple', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(res, '<h1>THIS IS AN EXAMPLE OF A GET REQUEST</h1>')];
            });
        }); }); };
        /**
         * @function secondMethod
         * @description secondMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.secondMethod = function () { return _this.route('post', '/post_example', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.exmaple_model
                    .all()
                    // @ts-ignore 
                    .then(function (_a) {
                    var rows = _a[0], fieldData = _a[1];
                    return _this.send(res, '<h1>DATA FETCHED FROM EXAMPLE MODEL SUCCESSFULY</h1>');
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function thirdMethod
         * @description thirdMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.thirdMethod = function () { return _this.route('put', '/put_example', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.exmaple_model
                    .all()
                    // @ts-ignore 
                    .then(function (_a) {
                    var rows = _a[0], fieldData = _a[1];
                    if (rows) {
                        // @ts-ignore 
                        var rows_1 = rows_1[0];
                        var id = rows_1['id'];
                        _this.exmaple_model.update(id)
                            // @ts-ignore 
                            .then(function () {
                            console.log('RECORD UPDATED :)');
                        })
                            .catch(function (err) { return _this.onError(res, next, err); });
                    }
                    return _this.redirect(res, '/get_example');
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function fourthMethod
         * @description fourthMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.fourthMethod = function () { return _this.route('patch', '/patch_example', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.exmaple_model
                    .all()
                    // @ts-ignore 
                    .then(function (_a) {
                    var rows = _a[0], fieldData = _a[1];
                    if (rows) {
                        // @ts-ignore 
                        var rows_2 = rows_2[0];
                        var id = rows_2['id'];
                        _this.exmaple_model.update(id)
                            // @ts-ignore 
                            .then(function () {
                            console.log('RECORD UPDATED :)');
                        })
                            .catch(function (err) { return _this.onError(res, next, err); });
                    }
                    return _this.redirect(res, '/get_example');
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function fifthMethod
         * @description fifthMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.fifthMethod = function () { return _this.route('delete', '/delete_example', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.exmaple_model
                    .all()
                    // @ts-ignore 
                    .then(function (_a) {
                    var rows = _a[0], fieldData = _a[1];
                    if (rows) {
                        // @ts-ignore 
                        var rows_3 = rows_3[0];
                        var id = rows_3['id'];
                        _this.exmaple_model.delete(id)
                            // @ts-ignore 
                            .then(function () {
                            console.log('RECORD DELETED :)');
                        })
                            .catch(function (err) { return _this.onError(res, next, err); });
                    }
                    return _this.redirect(res, '/get_example');
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function workerPool
         * @description workerPool function offloads heavy tasks to be executed by the cpu
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.workerPool = function () { return _this.route('get', '/workerpool/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                /*
                * Workerpool example
                */
                this.worker.loadProxy()
                    .then(function (methods) {
                    // @ts-ignore 
                    return methods.exampleLogger(100);
                })
                    .then(function (result) {
                    console.log(result);
                    return result;
                })
                    .catch(function (err) { return _this.onError(res, next, err); })
                    .then(function (result) {
                    res.status(200).send('<h1>Worker Pool In Progress</h1><br><p>' + result + '</p>');
                    res.end();
                    console.log('Terminating');
                    _this.worker.terminate();
                    console.log('is terminated ?: ', _this.worker.isTerminated());
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                ;
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function workerEmit
         * @description
         * workerEmit function offloads heavy tasks to be executed
         * by the cpu with the usage of status or state
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.workerEmit = function () { return _this.route('get', '/workeremit/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                /*
                * workerEmit event Exampel
                */
                this.worker.loadPool().exec('exampleLoggerWithEvent', [101], {
                    on: function (payload) {
                        if (payload.status === 'in_progress') {
                            console.log(payload);
                            console.log('In progress...');
                        }
                        else if (payload.status === 'complete') {
                            console.log('Done!');
                        }
                    }
                }).then(function (result) {
                    console.log(result);
                    return result;
                }).catch(function (err) { return _this.onError(res, next, err); })
                    .then(function (result) {
                    res.status(200).send('<h1>Worker Emit In Progress</h1><br><p>' + result + '</p>');
                    res.end();
                    console.log('Terminating');
                    _this.worker.terminate();
                    console.log('is terminated ?: ', _this.worker.isTerminated());
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                ;
                return [2 /*return*/];
            });
        }); }); };
        //******************\\
        //* DYNAMIC Routes *\\
        //******************\\
        /**
         * @function firstDynMethod
         * @description firstDynMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.firstDynMethod = function () { return _this.route('get', '/dynamic/:firstDynamicInput', _this.firstDynMethodMiddleware(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var dynamicInput;
            var _this = this;
            return __generator(this, function (_a) {
                dynamicInput = +req.getDynamicParam('dynamicInput') || false;
                // @ts-ignore 
                this.exmaple_model.filter(dynamicInput).then(function (_a) {
                    var rows = _a[0], fields = _a[1];
                    if (rows) {
                        // @ts-ignore 
                        var rows_4 = rows_4[0];
                        return _this.render(res, 'example/index', {
                            nav_title: rows_4 || 'Dynamic route',
                            path: '/dynamic/',
                            product: rows_4
                        });
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        /**
         * @function secondDynMethod
         * @description secondDynMethod route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Response
        */
        _this.secondDynMethod = function () { return _this.route('get', '/dynamic_two/:secondDynamicInput', _this.secondDynMethodMiddleware(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var dynamicInput;
            var _this = this;
            return __generator(this, function (_a) {
                dynamicInput = +req.getDynamicParam('dynamicInput') || false;
                this.exmaple_model.filter(dynamicInput)
                    // @ts-ignore 
                    .then(function (_a) {
                    var rows = _a[0], fields = _a[1];
                    if (rows) {
                        // @ts-ignore 
                        var rows_5 = rows_5[0];
                        return _this.render(res, 'example/index', {
                            nav_title: rows_5 || 'Dynamic route',
                            path: '/dynamic/',
                            product: rows_5
                        });
                    }
                })
                    .catch(function (err) { return _this.onError(res, next, err); });
                return [2 /*return*/];
            });
        }); }); };
        _this.secondDynMethodMiddleware = function () { return ({
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: function (req, res, next) { next(); },
            validate: (0, express_validator_1.check)('secondDynamicInput') //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
                .isEmpty()
                .bail()
                .withMessage('Dynamic param must not be empty!')
        }); };
        //? ************************************************************** ?\\
        //? this.method is used to deploy all the routes to express router ?\\
        //! dynamic routes must be the last index of the methods array     !\\
        //? ************************************************************** ?\\
        _this.methods = [
        //**********\\
        //* Routes *\\
        //**********\\
        // 'firstMethod',
        // 'secondMethod',
        // 'thirdMethod',
        // 'fourthMethod',
        // 'fifthMethod',
        // 'workerPool',
        // 'workerEmit',
        //******************\\
        //* DYNAMIC Routes *\\
        //******************\\
        // 'firstDynMethod'
        ];
        //**********************\\
        //* INIT EXAMPLE MODEL *\\
        //**********************\\
        _this.exmaple_model = new ExampleModel_1.default();
        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
        // this.constants
        //***************************\\
        //* INITIALISING WORKERPOOL *\\
        //***************************\\
        _this.worker = _this.express.getWorkerPool();
        return _this;
    }
    //! **************************** !\\
    //* Process protected functions  *\\
    //! **************************** !\\
    //* ************************* *\\
    //* firstDynMethod Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    ExampleController.prototype.firstDynMethodMiddleware = function () {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            is_authenticated: function (req, res, next) { next(); },
            validate: (0, express_validator_1.check)('firstDynamicInput') //* SECOND VALIDATE BODY, PARAM COOKIE OR HEADER *\\
                .isEmpty()
                .bail()
                .withMessage('Dynamic param must not be empty!')
        };
    };
    ;
    return ExampleController;
}(BaseController_1.default));

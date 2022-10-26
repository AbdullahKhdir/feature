//***********************************************************
//* CONTROLLER: LeageOfLegends.js
//***********************************************************
//* AUTHOR: Abdullah Khdir <abdullahkhder77@gmail.com>
//* BRANCH: develop
//***********************************************************
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
var events_1 = __importDefault(require("events"));
var express_validator_1 = require("express-validator"); //? EXPRESS VALIDATOR ?\\
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
var league_connect_1 = require("league-connect");
var path_1 = __importDefault(require("path"));
var ws_1 = require("ws");
var BaseController_1 = __importDefault(require("../../../core/controller/BaseController"));
var JsonResponse_1 = __importDefault(require("../../../core/response/types/JsonResponse"));
// @ts-ignore 
var fetch = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Promise.resolve().then(function () { return __importStar(require('node-fetch')); }).then(function (_a) {
        var fetch = _a.default;
        return fetch.apply(null, args);
    });
};
var event = new events_1.default();
module.exports = /** @class */ (function (_super) {
    __extends(LeageOfLegends, _super);
    function LeageOfLegends() {
        var _this = _super.call(this) || this;
        //*****************************************************************\\
        //? CONSTRUCTOR FOR INITIALIZING ALL THE NECESSARY CONFIGURATIONS ?\\
        //*****************************************************************\\
        _this.BASE_URI = "https://127.0.0.1:2999";
        _this.LIVE_EVENT = "/liveclientdata/eventdata";
        _this.get_options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            agent: new https_1.default.Agent({
                ca: fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'certificates', 'LOL', 'riotgames.pem'), 'utf-8')
            })
        };
        //**********\\
        //* Routes *\\
        //**********\\
        _this.corsTest = function () { return _this.route('get', '/cors/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new JsonResponse_1.default(200, 'Success', { status: 'checked' }).sendAsJson(res)];
            });
        }); }); };
        /**
         * @function getSummonerInfos
         * @description getSummonerInfos route
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns JsonResponse
        */
        _this.getSummonerInfos = function () { return _this.route('get', '/bySummonerName/:summonerName/', _this.getSummonerInfosMiddleware(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var summoner_name, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        summoner_name = req.getDynamicParam('summonerName');
                        return [4 /*yield*/, fetch("https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/".concat(summoner_name), {
                                method: 'get',
                                headers: { "X-Riot-Token": "RGAPI-40cea3f7-477d-4a5e-a801-af6a601addfc" }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, new JsonResponse_1.default(200, 'Fetched successfully', data).sendAsJson(res)];
                }
            });
        }); }); };
        _this.leagueLoginIn = function () { return _this.route('get', '/league-connect/', {}, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.render(res, 'LOL/login', {
                        nav_title: 'Live In Game Events',
                        path: 'league-connect',
                        root: 'league'
                    })];
            });
        }); }); };
        _this.leagueOnConnect = function () { return _this.route('POST', '/league-connect/', _this.getSummonerInfosMiddleware(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var credentials, game_Started;
            var _this = this;
            return __generator(this, function (_a) {
                if (!req.isPost()) {
                    return [2 /*return*/, this.siteNotFound(res)];
                }
                credentials = null;
                game_Started = false;
                event.on('onStart', function () {
                    console.log('Getting Live Events!');
                    var wss = new ws_1.WebSocketServer({ port: 9290 });
                    var interval;
                    wss.on('close', function close(ws) {
                        console.log('ws closing!');
                        clearInterval(interval);
                    });
                    wss.on('connection', function (ws) {
                        interval = setInterval(function () {
                            var _credentials = (0, league_connect_1.authenticate)({
                                awaitConnection: true,
                                pollInterval: 5000,
                            })
                                .then(function (result) {
                                var in_game = (0, league_connect_1.createHttp1Request)({
                                    method: 'GET',
                                    url: '/lol-gameflow/v1/gameflow-phase'
                                }, result)
                                    .then(function (result) {
                                    // @ts-ignore 
                                    if (result.__raw !== '"None"') {
                                        game_Started = true;
                                        var data = _this.get(_this.LIVE_EVENT);
                                        data.then(function (result) {
                                            ws.send(JSON.stringify(result));
                                        })
                                            .catch(function (err) { return err; });
                                    }
                                })
                                    .catch(function (err) { return err; });
                            })
                                .catch(function (err) { return err; });
                        }, 2000);
                    });
                });
                credentials = (0, league_connect_1.authenticate)({
                    awaitConnection: true,
                    pollInterval: 5000,
                }).then(function (result) {
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var ws;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.emit('onStart');
                                    return [4 /*yield*/, (0, league_connect_1.createWebSocketConnection)(result)];
                                case 1:
                                    ws = _a.sent();
                                    ws.on('open', function (ws) {
                                        console.log('ws started...');
                                        // Subscribe to any websocket event
                                        // console.log(message)
                                        // ws.on('connection', (stream) => {
                                        //     console.log('someone connected!');
                                        //     console.log(stream)
                                        // });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                })
                    .catch(function (err) { return _this.onError(res, err); });
                return [2 /*return*/];
            });
        }); }); };
        //! **************************** !\\
        //* Process protected functions  *\\
        //! **************************** !\\
        _this.get = function (endpoint, options) {
            if (options === void 0) { options = _this.get_options; }
            return (function () { return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("".concat(this.BASE_URI).concat(endpoint), options)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            }); })();
        };
        //? ************************************************************** ?\\
        //? this.method is used to deploy all the routes to express router ?\\
        //! dynamic routes must be the last index of the methods array     !\\
        //? ************************************************************** ?\\
        _this.methods = [
            //**********\\
            //* Routes *\\
            //**********\\
            'getSummonerInfos',
            'leagueLoginIn',
            'leagueOnConnect',
            'corsTest',
            //******************\\
            //* DYNAMIC Routes *\\
            //******************\\
        ];
        return _this;
        //***************\\
        //* INIT MODELS *\\
        //***************\\
        //*********************\\
        //* PROJECT CONSTANTS *\\
        //*********************\\
        // this.constants
    }
    //* ************************* *\\
    //* firstDynMethod Middleware *\\
    //? SHOULD BE PROTECTED       ?\\
    //* ************************* *\\
    LeageOfLegends.prototype.getSummonerInfosMiddleware = function () {
        return {
            //? YOU CAN ADD ALL THE NECESSARY MIDDLEWARES ?\\
            //! IMPORTANT THE ORDER MATTERS !\\
            validate_username: (0, express_validator_1.body)('username').isString().withMessage('Username and password must not be empty!').bail(),
            validate_password: (0, express_validator_1.body)('password').isString().withMessage('Username and password must not be empty!').bail()
        };
    };
    ;
    return LeageOfLegends;
}(BaseController_1.default));

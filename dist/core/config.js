"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurations = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var cmd = __importStar(require("./utils/CommandExecuter"));
dotenv_1.default.config();
function configurations() {
    var _a, _b, _c, _d, _e;
    return {
        host: process.env['HOST'],
        port: process.env['DB_PORT'],
        user: (_b = (_a = process.env['TEST_USERNAME']) !== null && _a !== void 0 ? _a : process.env['PRODUCTION_USERNAME']) !== null && _b !== void 0 ? _b : process.env['DEVELOPMENT_USERNAME'],
        password: (_d = (_c = process.env['TEST_PASSWORD']) !== null && _c !== void 0 ? _c : process.env['PRODUCTION_PASSWORD']) !== null && _d !== void 0 ? _d : process.env['DEVELOPMENT_PASSWORD'],
        database: process.env['DATABASE'],
        connectionLimit: process.env['CONNECTION_LIMIT'],
        encryption_key: '$2a$12$CAVyfpGSo.AbWgby9JNCXOf4rt7GFbxxSimczOqKvzrdCOAK5CT9u',
        environment: process.env['NODE_ENV'],
        server_port: process.env['PORT'],
        migration: process.env['MIGRATION'],
        is_worker_pool_active: process.env['WORKER_POOL_ENABLED'] === "0" ? process.env['NODE_ENV'] === 'production' ? process.env['WORKER_POOL_ENABLED'] = "1" : process.env['WORKER_POOL_ENABLED'] = "0" : process.env['WORKER_POOL_ENABLED'],
        os: process.platform === 'darwin' ? 'MAC' : process.platform === 'linux' ? 'LINUX' : process.platform === 'win32' ? 'WINDOWS' : process.platform === 'freebsd' || process.platform === 'openbsd' || process.platform === 'sunos' ? 'UNIX' : 'UNKNOWN',
        socket_path: process.platform !== 'win32' ? cmd._mysqlSocket() : '',
        execution_point: (_e = process.env['EXECUTION_POINT']) !== null && _e !== void 0 ? _e : ''
    };
}
exports.configurations = configurations;
;

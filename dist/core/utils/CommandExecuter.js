"use strict";
'use_strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
exports._mysqlSocket = exports.execShellCommand = exports.runCommands = void 0;
var child_process_1 = __importDefault(require("child_process"));
/**
 * Executes a shell an array of commands.
 * @param array {Array}
 * @param callback {Function}
 * @return void
*/
var runCommands = function (array, callback) {
    var index = 0;
    var results = [];
    function next() {
        if (index < array.length) {
            child_process_1.default.exec(array[index++], function (err, stdout) {
                if (err)
                    return callback(err);
                // do the next iteration
                results.push(stdout);
                next();
            });
        }
        else {
            // all done here
            callback(null, results);
        }
    }
    // start the first iteration
    next();
};
exports.runCommands = runCommands;
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
*/
var _execShellCommand = function (cmd) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                child_process_1.default.exec(cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.warn(error);
                    }
                    resolve(stdout ? stdout : stderr);
                });
            })];
    });
}); };
/**
 * Wrapper
 * @param cmd {string}
 * @return string
*/
var execShellCommand = function (cmd) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _execShellCommand(cmd)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.execShellCommand = execShellCommand;
/**
 * Mysql Configutation Socket für UNIX, LINUX & MAC OSs
 * @param cmd {string}
 * @return string
*/
var _mysqlSocket = function () {
    var cmd = 'mysql_config --socket';
    return syncExecShellCmd(cmd);
};
exports._mysqlSocket = _mysqlSocket;
/**
 * Sync Command Execution
 * @param cmd {string}
 * @return string
*/
var syncExecShellCmd = function (cmd) {
    // return exec.execFileSync(cmd).toString();
};

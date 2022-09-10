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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Singleton_1 = require("../../Singleton/Singleton");
var ApiError_1 = __importDefault(require("../ApiError"));
/**
 * @class BadRequestError
 * @constructor
 * @extends ApiError
 * @description The 400 Bad Request Error is an HTTP response status code indicating
 *  that the server was unable to process the request sent by the client
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        if (message === void 0) { message = 'Bad Request'; }
        return _super.call(this, Singleton_1.Singleton.getConstants().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST, message) || this;
        // TODO: render bad request error page
    }
    return BadRequestError;
}(ApiError_1.default));

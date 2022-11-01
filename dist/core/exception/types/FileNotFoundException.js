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
var ApiException_1 = __importDefault(require("../ApiException"));
/**
 * @class FileNotFoundException
 * @constructor
 * @extends ApiException
 * @description This is used to identify When file is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 //? Usage:                                                             *\\
 //* return next(new FileNotFoundException('File Not Found Exception')) *\\
*/
module.exports = /** @class */ (function (_super) {
    __extends(FileNotFoundException, _super);
    function FileNotFoundException(message, status_code) {
        if (message === void 0) { message = 'File not found exception'; }
        var _constants = Singleton_1.Singleton.getConstants();
        return _super.call(this, status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message) || this;
    }
    return FileNotFoundException;
}(ApiException_1.default));

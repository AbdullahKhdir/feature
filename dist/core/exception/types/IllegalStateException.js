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
var ApiException_1 = __importDefault(require("../ApiException"));
/**
 * @class IllegalStateException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when the state of the environment
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = /** @class */ (function (_super) {
    __extends(IllegalStateException, _super);
    function IllegalStateException(message) {
        if (message === void 0) { message = 'Illegal state exception'; }
        return _super.call(this, 'Illegal state exception', message) || this;
        // TODO: render bad request error page
    }
    return IllegalStateException;
}(ApiException_1.default));
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_session_1 = __importDefault(require("express-session"));
module.exports = /** @class */ (function () {
    function ExpressSession() {
        ExpressSession.express_session = express_session_1.default;
    }
    Object.defineProperty(ExpressSession, "getExpressSession", {
        get: function () {
            if (this.express_session) {
                return this.express_session;
            }
            return this.express_session = express_session_1.default;
        },
        enumerable: false,
        configurable: true
    });
    return ExpressSession;
}());

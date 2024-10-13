"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_session_1 = __importDefault(require("express-session"));
module.exports = /** @class */ (function () {
    function ExpressSession() {
        if (!ExpressSession.expressSession) {
            ExpressSession.expressSession = express_session_1.default;
        }
    }
    return ExpressSession;
}());

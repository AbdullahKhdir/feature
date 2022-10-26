"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var morgan_1 = __importDefault(require("morgan"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Constants_1 = __importDefault(require("../../app/utils/Constants"));
module.exports = (0, morgan_1.default)('combined', {
    stream: fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', 'access.log'), { flags: 'a' }),
    skip: function (req, res) { return res.statusCode <= Constants_1.default.getConstantsInstance().HTTPS_STATUS.CLIENT_ERRORS.BAD_REQUEST; }
});

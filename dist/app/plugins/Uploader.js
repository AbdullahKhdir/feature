'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var multer_1 = __importDefault(require("multer"));
module.exports = /** @class */ (function () {
    function Uploader() {
        this.multer = multer_1.default;
    }
    /**
     * @function getBodyParserInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    Uploader.getMulterInstance = function () {
        if (this.instance) {
            return this.instance.multer;
        }
        this.instance = new Uploader();
        return this.instance.multer;
    };
    Object.defineProperty(Uploader.prototype, "getMulter", {
        /**
         * @function getBodyParser
         * @description Getter method for body parser object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns FileSystem
        */
        get: function () {
            return this.multer;
        },
        enumerable: false,
        configurable: true
    });
    return Uploader;
}());

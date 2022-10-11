'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var jquery_file_upload_middleware_1 = __importDefault(require("jquery-file-upload-middleware"));
module.exports = /** @class */ (function () {
    function JUploader() {
        this.uploader = jquery_file_upload_middleware_1.default;
    }
    /**
     * @function getUploaderInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Uploader
    */
    JUploader.getUploaderInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new JUploader();
        return this.instance;
    };
    Object.defineProperty(JUploader.prototype, "getUploader", {
        /**
         * @function getUploader
         * @description Getter method for uploader object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Uploader
        */
        get: function () {
            return this.uploader;
        },
        enumerable: false,
        configurable: true
    });
    return JUploader;
}());

'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = __importDefault(require("path"));
module.exports = /** @class */ (function () {
    function Path() {
        this.path = path_1.default;
    }
    /**
     * @function getPathInstance
     * @description Inits or gives back an instance for path class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    Path.getPathInstance = function () {
        if (this.instance) {
            return this.instance.getPath;
        }
        this.instance = new Path();
        return this.instance.getPath;
    };
    Object.defineProperty(Path.prototype, "getPath", {
        /**
         * @function getPath
         * @description Getter method for path object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Path
        */
        get: function () {
            return this.path;
        },
        enumerable: false,
        configurable: true
    });
    return Path;
}());

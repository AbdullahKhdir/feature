'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
module.exports = /** @class */ (function () {
    function FileSystem() {
        this.file_system = fs_1.default;
    }
    /**
     * @function getPathInstance
     * @description Inits or gives back an instance for path class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    FileSystem.getFileSystemInstance = function () {
        if (this.instance) {
            return this.instance.getFileSystem;
        }
        this.instance = new FileSystem();
        return this.instance.getFileSystem;
    };
    Object.defineProperty(FileSystem.prototype, "getFileSystem", {
        /**
         * @function getFileSystem
         * @description Getter method for fs object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns FileSystem
        */
        get: function () {
            return this.file_system;
        },
        enumerable: false,
        configurable: true
    });
    return FileSystem;
}());

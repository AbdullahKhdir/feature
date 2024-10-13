"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
var _this = this;
var fs_1 = __importDefault(require("fs"));
var fs_2 = require("fs");
var Singleton_1 = require("../Singleton/Singleton");
module.exports = (_a = /** @class */ (function () {
        function FileSystem() {
            this.fileSystem = fs_1.default;
            this.promisifyfileSystem = fs_2.promises;
        }
        /**
         * @function getPathInstance
         * @description Inits or gives back an instance for path class
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns Path
         */
        FileSystem.getPromisifyFileSystemInstance = function () {
            if (this.instance) {
                return this.instance.getPromisifyFileSystem;
            }
            this.instance = new FileSystem();
            return this.instance.getPromisifyFileSystem;
        };
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
        Object.defineProperty(FileSystem.prototype, "getPromisifyFileSystem", {
            /**
             * @function getPromisifyFileSystem
             * @description Getter method for promisify fs object
             * @version 1.0.0
             * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
             * @returns FileSystem
             */
            get: function () {
                return this.promisifyfileSystem;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FileSystem.prototype, "getFileSystem", {
            /**
             * @function getFileSystem
             * @description Getter method for fs object
             * @version 1.0.0
             * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
             * @returns FileSystem
             */
            get: function () {
                return this.fileSystem;
            },
            enumerable: false,
            configurable: true
        });
        return FileSystem;
    }()),
    _a.getAllSubfolders = function (dirPath, recursionDepth, maxRecursionDepth) {
        if (recursionDepth === void 0) { recursionDepth = 0; }
        if (maxRecursionDepth === void 0) { maxRecursionDepth = 0; }
        var subfolders = new Set();
        var path = Singleton_1.Singleton.getPath();
        fs_1.default.readdirSync(dirPath).forEach(function (file) {
            var fullPath = path.join(dirPath, file);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                subfolders.add("/".concat(file, "/"));
                if (recursionDepth < maxRecursionDepth) {
                    var nestedSubfolders = _a.getAllSubfolders(fullPath, recursionDepth + 1, maxRecursionDepth);
                    nestedSubfolders.forEach(function (folder) { return subfolders.add(folder); });
                }
            }
        });
        return Array.from(subfolders);
    },
    _a);

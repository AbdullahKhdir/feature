'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var lodash_1 = __importDefault(require("lodash"));
module.exports = /** @class */ (function () {
    function Lodash() {
        this.lodash = lodash_1.default;
    }
    /**
     * @function getLodashInstance
     * @description Inits or gives back an instance for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    Lodash.getLodashInstance = function () {
        if (this.lodash_instance) {
            return this.lodash_instance.getLodash;
        }
        this.lodash_instance = new Lodash();
        return this.lodash_instance.getLodash;
    };
    Object.defineProperty(Lodash.prototype, "getLodash", {
        /**
         * @function getLodash
         * @description Getter method for _ object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns FileSystem
        */
        get: function () {
            return this.lodash;
        },
        enumerable: false,
        configurable: true
    });
    return Lodash;
}());

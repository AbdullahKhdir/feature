'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var i18n_1 = __importDefault(require("i18n"));
module.exports = /** @class */ (function () {
    function I18next() {
        this.i18next = i18n_1.default;
    }
    /**
     * @function getI18nextInstance
     * @description Inits or gives back an instance for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    I18next.getI18nextInstance = function () {
        if (this.i18next) {
            return this.i18next.getI18next;
        }
        this.i18next = new I18next();
        return this.i18next.getI18next;
    };
    Object.defineProperty(I18next.prototype, "getI18next", {
        /**
         * @function getLodash
         * @description Getter method for _ object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns FileSystem
        */
        get: function () {
            return this.i18next;
        },
        enumerable: false,
        configurable: true
    });
    return I18next;
}());

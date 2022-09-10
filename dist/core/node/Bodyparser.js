'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var body_parser_1 = __importDefault(require("body-parser"));
module.exports = /** @class */ (function () {
    function Bodyparser() {
        this.body_parser = body_parser_1.default;
    }
    /**
     * @function getBodyParserInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    Bodyparser.getBodyParserInstance = function () {
        if (this.instance) {
            return this.instance.getBodyParser;
        }
        this.instance = new Bodyparser();
        return this.instance.getBodyParser;
    };
    Object.defineProperty(Bodyparser.prototype, "getBodyParser", {
        /**
         * @function getBodyParser
         * @description Getter method for body parser object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns FileSystem
        */
        get: function () {
            return this.body_parser;
        },
        enumerable: false,
        configurable: true
    });
    return Bodyparser;
}());

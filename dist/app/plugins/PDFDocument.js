'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var pdfkit_1 = __importDefault(require("pdfkit"));
module.exports = /** @class */ (function () {
    function PDFDocument() {
        this.pdfkit = new pdfkit_1.default();
    }
    /**
     * @function PDFDocument
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns PDFDocument
    */
    PDFDocument.getPDFDocumentInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new PDFDocument();
        return this.instance;
    };
    Object.defineProperty(PDFDocument.prototype, "getPdfKit", {
        /**
         * @function getBodyParser
         * @description Getter method for pdfkit object
         * @version 1.0.0
         * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
         * @returns pdfkit
        */
        get: function () {
            return this.pdfkit;
        },
        enumerable: false,
        configurable: true
    });
    return PDFDocument;
}());

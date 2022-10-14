'use strict';

import pdfkit from 'pdfkit';

/**
 * @class PDFDocument
 * @constructor
 * @description Class PDFDocument is used to create pdf files
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class PDFDocument {
    
    private static instance: PDFDocument;
    private pdfkit: typeof pdfkit;
    private constructor() {
        this.pdfkit = new pdfkit();
    }

    /**
     * @function PDFDocument
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns PDFDocument
    */
    static getPDFDocumentInstance () : PDFDocument {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new PDFDocument();
        return this.instance
    }

    /**
     * @function getBodyParser
     * @description Getter method for pdfkit object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns pdfkit
    */
    get getPdfKit() : typeof pdfkit {
        return this.pdfkit;
    }
}

'use strict';

import multer from 'multer';

/**
 * @class Uploader
 * @constructor
 * @description Class Uploader is used to process uploaded files
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Uploader {
    
    private static instance: Uploader;
    private multer: typeof multer;
    private constructor() {
        this.multer = multer;
    }

    /**
     * @function getBodyParserInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    static getMulterInstance () : typeof multer {
        if (this.instance) {
            return this.instance.multer;
        }
        this.instance = new Uploader();
        return this.instance.multer
    }

    /**
     * @function getBodyParser
     * @description Getter method for body parser object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    private get getMulter() : typeof multer {
        return this.multer;
    }
}
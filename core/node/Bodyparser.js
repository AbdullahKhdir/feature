'use strict';

/**
 * @class Bodyparser
 * @constructor
 * @description Class Bodyparser is used to parse the sent body 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Bodyparser {
    
    constructor(body_parser = require('body-parser')) {
        if (typeof this.body_parser !== 'undefined') {
            return this.getBodyParserInstance();
        }
        this.body_parse = body_parser;
    }

    /**
     * @function getBodyParserInstance
     * @description Getter method for body parser object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    getBodyParserInstance () {
        return this.body_parser;
    }
}
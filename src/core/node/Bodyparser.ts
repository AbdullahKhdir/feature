'use strict';

import bodyParser from 'body-parser';

/**
 * @class Bodyparser
 * @constructor
 * @description Class Bodyparser is used to parse the sent body 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Bodyparser {
    
    private static instance: Bodyparser;
    private body_parser: bodyParser.BodyParser;
    private constructor() {
        this.body_parser = bodyParser
    }

    /**
     * @function getBodyParserInstance
     * @description Inits or gives back an instance
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    static getBodyParserInstance () : bodyParser.BodyParser {
        if (this.instance) {
            return this.instance.getBodyParser;
        }
        this.instance = new Bodyparser();
        return this.instance.getBodyParser
    }

    /**
     * @function getBodyParser
     * @description Getter method for body parser object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    private get getBodyParser() : bodyParser.BodyParser {
        return this.body_parser;
    }
}
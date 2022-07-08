'use strict';

module.exports = class Bodyparser {
    
    constructor(body_parser = require('body-parser')) {
        if (typeof this.body_parser !== 'undefined') {
            return this.getBodyParserInstance();
        }
        this.body_parse = body_parser;
    }

    getBodyParserInstance () {
        return this.body_parser;
    }
}
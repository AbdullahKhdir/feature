'use strict';

const ApiResponse = require('../response/ApiResponse');

/**
 * @class Express
 * @constructor
 * @extends ApiResponse
 * @description Class Express to define and initiate the express framework 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Express extends ApiResponse {
    
    constructor(framework = require('express')) {
        super();
        this.framework = framework;
        this.cors      = require('cors');
    }
}
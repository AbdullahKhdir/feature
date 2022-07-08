'use strict';

const ApiResponse = require('../response/ApiResponse');

module.exports = class Express extends ApiResponse {
    
    constructor(framework = require('express')) {
        super();
        this.framework = framework;
        this.cors      = require('cors');
    }
}
'use strict';

const Constants = require("../../app/utils/Constants");

/**
 * @class ApiError
 * @constructor
 * @extends Error
 * @description Class ApiError to handle all kinds of errors objects 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class ApiError extends Error {
    
    #constants;
    constructor(type, message) {
        const error_msg_with_code = type + ': ' + message;
        super(error_msg_with_code);
        this.#constants = Object.assign(new Constants);
    }
 }
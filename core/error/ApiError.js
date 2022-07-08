'use strict';

const Constants = require("../../app/utils/Constants");

module.exports = class ApiError extends Error {
    
    #constants;
    constructor(type, message) {
        const error_msg_with_code = type + ': ' + message;
        super(error_msg_with_code);
        this.#constants = Object.assign(new Constants);
    }
 }
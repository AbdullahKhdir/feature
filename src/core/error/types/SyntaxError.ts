'use strict';

import ApiError  from "../ApiError";

/**
 * @class SyntaxError
 * @constructor
 * @extends ApiError
 * @description This is the most common error we encounter. 
 * This error occurs when we type code that the JS engine can understand.
 * That is the variable/item doesn’t exist.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class SyntaxError extends ApiError {
    constructor(message = 'Syntax error') {
        super('Syntax error', message);
        // TODO: render bad request error page
    }
 }
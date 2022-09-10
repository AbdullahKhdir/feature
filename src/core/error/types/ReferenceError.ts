'use strict';

import ApiError  from "../ApiError";

/**
 * @class ReferenceError
 * @constructor
 * @extends ApiError
 * @description This exception is thrown when a reference made to a variable/item is broken. 
 * That is the variable/item doesn’t exist.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ReferenceError extends ApiError {
    constructor(message = 'Reference error') {
        super('Reference error', message);
        // TODO: render bad request error page
    }
 }
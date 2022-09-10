'use strict';

import ApiError  from "../ApiError";

/**
 * @class RangeError
 * @constructor
 * @extends ApiError
 * @description This is thrown when a number is outside an allowable range of values.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class RangeError extends ApiError {
    constructor(message = 'Range error') {
        super('Range error', message);
        // TODO: render bad request error page
    }
 }
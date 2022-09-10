'use strict';

import ApiError from "../ApiError";

/**
 * @class InternalError
 * @constructor
 * @extends ApiError
 * @description This error occurs internally in the JS engine, 
 * especially when it has too much data to handle and the stack grows way over its critical limit.
 * This occurs when the JS engine is overwhelmed by too many recursions, too many switch cases, etc
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class InternalError extends ApiError {
    constructor(message = 'Internal error') {
        super('Internal error', message);
        // TODO: render bad request error page
    }
 }
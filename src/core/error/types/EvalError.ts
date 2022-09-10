'use strict';

import ApiError  from "../ApiError";

/**
 * @class EvalError
 * @constructor
 * @extends ApiError
 * @description This is used to identify errors when using the global eval() function.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class EvalError extends ApiError {
    constructor(message = 'Eval error') {
        super('Eval error', message);
        // TODO: render bad request error page
    }
 }
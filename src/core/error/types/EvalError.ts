'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiError  from "../ApiError";

/**
 * @class EvalError
 * @constructor
 * @extends ApiError
 * @description This is used to identify errors when using the global eval() function.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 //? Usage:                                   *\\
 //* return next(new EvalError('Eval Error')) *\\
*/
export = class EvalError extends ApiError {
    constructor(message = 'Eval error', status_code?: number) {
        super(status_code ? status_code : Singleton.getConstants().HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
    }
}
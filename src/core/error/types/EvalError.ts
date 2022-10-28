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
*/
export = class EvalError extends ApiError {
    constructor(status_code?: number, message = 'Eval error') {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND, message);
        // next error middleware will send or render the page
    }
 }
'use strict';

import { Singleton } from "../../Singleton/Singleton";
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
    constructor(message = 'Syntax error', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
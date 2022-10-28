'use strict';

import { Singleton } from "../../Singleton/Singleton";
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
    constructor(status_code?: number, message = 'Reference error') {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
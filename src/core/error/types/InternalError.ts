'use strict';

import { Singleton } from "../../Singleton/Singleton";
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
    constructor(status_code?: number, message = 'Internal error') {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.CLIENT_ERRORS.SITE_NOT_FOUND, message);
        // next error middleware will send or render the page
    }
 }
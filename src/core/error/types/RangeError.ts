'use strict';

import { Singleton } from "../../Singleton/Singleton";
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
    constructor(message = 'Range error', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException  from "../ApiException";

/**
 * @class ArrayIndexOutOfBound
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an array with an invalid index value.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ArrayIndexOutOfBound extends ApiException {
    constructor(message = 'Array index out of bound', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
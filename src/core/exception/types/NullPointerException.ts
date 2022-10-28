'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class NullPointerException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an object 
 * with the help of a reference variable whose current value is null or empty
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class NullPointerException extends ApiException {
    constructor(message = 'Null pointer exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
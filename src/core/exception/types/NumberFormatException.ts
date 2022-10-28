'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class NumberFormatException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs 
 * when you pass a string to a method that cannot be converted to a number
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class NumberFormatException extends ApiException {
    constructor(message = 'Number format exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
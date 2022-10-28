'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException  from "../ApiException";

/**
 * @class IllegalArgumentException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs 
 * whenever an inappropriate or incorrect argument is passed to a method
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class IllegalArgumentException extends ApiException {
    constructor(message = 'Illegal argument exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
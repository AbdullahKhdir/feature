'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException  from "../ApiException";

/**
 * @class IllegalStateException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when the state of the environment 
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class IllegalStateException extends ApiException {
    constructor(message = 'Illegal state exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
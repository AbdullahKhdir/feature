'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class ArithmeticException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you perform an incorrect arithmetic operation.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ArithmeticException extends ApiException {
    constructor(message = 'Arithmetic exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
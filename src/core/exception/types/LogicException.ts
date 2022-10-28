'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class LogicException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you implement logic that does not fullfil
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class LogicException extends ApiException {
    constructor(message = 'Logic exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
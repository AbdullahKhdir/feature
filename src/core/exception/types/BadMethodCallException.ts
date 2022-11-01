'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class BadMethodCallException
 * @constructor
 * @extends ApiException
 * @description This is thrown when a function or operation failed 
 * due to missing parameter or config
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
//? Usage:                                                               *\\
//* return next(new BadMethodCallException('Bad Method Call Exception')) *\\
*/
export = class BadMethodCallException extends ApiException {
    constructor(message = 'Bad method call exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
    }
}
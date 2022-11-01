'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException  from "../ApiException";

/**
 * @class ClassNotFoundException
 * @constructor
 * @extends ApiException
 * @description This type of exception is thrown when the required class is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 //? Usage:                                                               *\\
 //* return next(new ClassNotFoundException('Class Not Found Exception')) *\\
*/
export = class ClassNotFoundException extends ApiException {
    constructor(message = 'Class not found exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
    }
 }
'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException  from "../ApiException";

/**
 * @class FileNotFoundException
 * @constructor
 * @extends ApiException
 * @description This is used to identify When file is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 //? Usage:                                                             *\\
 //* return next(new FileNotFoundException('File Not Found Exception')) *\\
*/
module.exports = class FileNotFoundException extends ApiException {
    constructor(message = 'File not found exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
    }
}
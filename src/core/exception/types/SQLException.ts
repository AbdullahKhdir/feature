'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class SQLException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs while executing faulty queries on a database related to the SQL syntax
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 //? Usage:                                     *\\
 //* return next(new SQLException('SQL Error')) *\\
*/
export = class SQLException extends ApiException {
    constructor(message = 'SQL Exception', status_code?: number) {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
    }
 }
'use strict';

import ApiException  from "../ApiException";

/**
 * @class IOException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs while using file I/O stream operations
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class IOException extends ApiException {
    constructor(message = 'IO Exception') {
        super('IO Exception', message);
        // TODO: render bad request error page
    }
 }
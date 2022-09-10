'use strict';

import ApiException  from "../ApiException";

/**
 * @class ClassNotFoundException
 * @constructor
 * @extends ApiException
 * @description This type of exception is thrown when the required class is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ClassNotFoundException extends ApiException {
    constructor(message = 'Class not found exception') {
        super('Class not found exception', message);
        // TODO: render bad request error page
    }
 }
'use strict';

import ApiException from "../ApiException";

/**
 * @class NullPointerException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an object 
 * with the help of a reference variable whose current value is null or empty
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class NullPointerException extends ApiException {
    constructor(message = 'Null pointer exception') {
        super('Null pointer exception', message);
        // TODO: render bad request error page
    }
 }
'use strict';

import ApiException from "../ApiException";

/**
 * @class NumberFormatException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs 
 * when you pass a string to a method that cannot be converted to a number
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class NumberFormatException extends ApiException {
    constructor(message = 'Number format exception') {
        super('Number format exception', message);
        // TODO: render bad request error page
    }
 }
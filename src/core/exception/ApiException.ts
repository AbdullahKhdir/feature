'use strict';

/**
 * @class ApiException
 * @constructor
 * @extends Error
 * @description Class ApiException to throw all kinds of exceptions 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ApiException extends Error {
    
    constructor(type: any, message: any) {
        const exception_msg = type + ': ' + message;
        super(exception_msg);
    }
 }
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
    constructor(status_code: number, message: any) {
        let _super = super(message);
        // @ts-ignore
        _super.statusCode = status_code;
    }
 }
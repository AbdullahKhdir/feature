'use strict';

/**
 * @class ApiError
 * @constructor
 * @extends Error
 * @description Class ApiError to handle all kinds of errors objects 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ApiError extends Error {
    constructor(status_code: number, message: any) {
        let _super = super(message);
        // @ts-ignore
        _super.statusCode = status_code;
    }
 }
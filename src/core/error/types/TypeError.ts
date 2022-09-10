'use strict';


import ApiError  from "../ApiError";

/**
 * @class TypeError
 * @constructor
 * @extends ApiError
 * @description TypeError is used to indicate an unsuccessful operation 
 * when none of the other NativeError objects are an appropriate indication of the failure cause.
 * TypeError occurs when an operation is performed on a wrong data type. 
 * Maybe a boolean is expected but a sting is found.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class TypeError extends ApiError {
    constructor(message = 'Type error') {
        super('Type error', message);
        // TODO: render bad request error page
    }
 }
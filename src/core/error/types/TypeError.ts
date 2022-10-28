'use strict';


import { Singleton } from "../../Singleton/Singleton";
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
    constructor(status_code?: number, message = 'Type error') {
        const _constants = Singleton.getConstants();
        super(status_code ? status_code : _constants.HTTPS_STATUS.SERVER_ERRORS.INTERNAL_SERVER_ERROR, message);
        // next error middleware will send or render the page
    }
 }
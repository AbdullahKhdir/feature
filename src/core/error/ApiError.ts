'use strict';

import { Singleton } from "../Singleton/Singleton";

/**
 * @class ApiError
 * @constructor
 * @extends Error
 * @description Class ApiError to handle all kinds of errors objects 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ApiError extends Error {
    
    protected constants: any;
    constructor(type: any, message: any) {
        const error_msg_with_code = type + ': ' + message;
        super(error_msg_with_code);
        this.constants = Singleton.getConstants();
    }
 }
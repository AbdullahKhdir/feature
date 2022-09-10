'use strict';

import ApiException  from "../ApiException";

/**
 * @class ArrayIndexOutofBound
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you try to access an array with an invalid index value.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ArrayIndexOutofBound extends ApiException {
    constructor(message = 'Array index out of bound') {
        super('Array index out of bound', message);
        // TODO: render bad request error page
    }
 }
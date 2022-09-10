'use strict';

import ApiException  from "../ApiException";

/**
 * @class IllegalArgumentException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs 
 * whenever an inappropriate or incorrect argument is passed to a method
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class IllegalArgumentException extends ApiException {
    constructor(message = 'Illegal argument exception') {
        super('Illegal argument exception', message);
        // TODO: render bad request error page
    }
 }
'use strict';

import ApiException  from "../ApiException";

/**
 * @class IllegalStateException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when the state of the environment 
 * does not match the operation being executed
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class IllegalStateException extends ApiException {
    constructor(message = 'Illegal state exception') {
        super('Illegal state exception', message);
        // TODO: render bad request error page
    }
 }
'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class BadMethodCallException
 * @constructor
 * @extends ApiException
 * @description This is thrown when a function or operation failed 
 * due to missing parameter or config
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class BadMethodCallException extends ApiException {
    constructor(message = 'Bad method call exception') {
        const _constants = Singleton.getConstants();
        super('Bad method call exception', message);
        // TODO: render bad request error page
    }
 }
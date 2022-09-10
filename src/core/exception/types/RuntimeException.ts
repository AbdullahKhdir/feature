'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class RuntimeException
 * @constructor
 * @extends ApiException
 * @description RuntimeException is the superclass of those exceptions that can be thrown during the normal operation
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class RuntimeException extends ApiException {
    constructor(message = 'Runtime exception') {
        const _constants = Singleton.getConstants();
        super('Runtime exception', message);
        // TODO: render bad request error page
    }
 }
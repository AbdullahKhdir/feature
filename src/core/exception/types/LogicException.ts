'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class LogicException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you implement logic that does not fullfil
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class LogicException extends ApiException {
    constructor(message = 'Logic exception') {
        const _constants = Singleton.getConstants();
        super('Logic exception', message);
        // TODO: render bad request error page
    }
 }
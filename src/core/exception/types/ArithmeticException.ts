'use strict';

import { Singleton } from "../../Singleton/Singleton";
import ApiException from "../ApiException";

/**
 * @class ArithmeticException
 * @constructor
 * @extends ApiException
 * @description This type of exception occurs when you perform an incorrect arithmetic operation.
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class ArithmeticException extends ApiException {
    constructor(message = 'Arithmetic exception') {
        const _constants = Singleton.getConstants();
        super('Arithmetic exception', message);
        // TODO: render bad request error page
    }
 }
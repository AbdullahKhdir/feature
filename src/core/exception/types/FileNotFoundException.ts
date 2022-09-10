'use strict';

import ApiException  from "../ApiException";

/**
 * @class FileNotFoundException
 * @constructor
 * @extends ApiException
 * @description This is used to identify When file is not found
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class FileNotFoundException extends ApiException {
    constructor(message = 'File not found exception') {
        super('File not found exception', message);
        // TODO: render bad request error page
    }
 }
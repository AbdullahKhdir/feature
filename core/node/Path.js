'use strict';

/**
 * @class FileSystem
 * @constructor
 * @description Class FileSystem is used to get the object of the path
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class Path {
    
    constructor(path = require('path')) {
        if (typeof this.path !== 'undefined') {
            return this.getPathInstance();
        }
        this.path = path;
    }


    getPathInstance() {
        return this.path;
    }
}
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


    /**
     * @function getPathInstance
     * @description Getter method for path object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    getPathInstance() {
        return this.path;
    }
}
'use strict';

/**
 * @class FileSystem
 * @constructor
 * @description Class FileSystem is used to access the file system 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class FileSystem {
    
    constructor(fs = require('fs')) {
        if (typeof this.fs !== 'undefined') {
            return this.getFileSystemInstance();
        }
        
        this.fs = fs;
    }

    /**
     * @function getFileSystemInstance
     * @description Getter method for file system object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    getFileSystemInstance () {
        return this.fs;
    }
}
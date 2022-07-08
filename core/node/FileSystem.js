'use strict';

module.exports = class FileSystem {
    
    constructor(fs = require('fs')) {
        if (typeof this.fs !== 'undefined') {
            return this.getFileSystemInstance();
        }
        
        this.fs = fs;
    }

    getFileSystemInstance () {
        return this.fs;
    }
}
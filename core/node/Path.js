'use strict';

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
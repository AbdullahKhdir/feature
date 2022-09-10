'use strict';

import path from "path";

/**
 * @class Path
 * @constructor
 * @description Class Path is used to get the path object
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class Path {
    
    private static instance: Path;
    private path: path.PlatformPath;
    
    private constructor() {
        this.path = path;
    }

    /**
     * @function getPathInstance
     * @description Inits or gives back an instance for path class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    static getPathInstance() : path.PlatformPath {
        if (this.instance) {
            return this.instance.getPath;
        }
        this.instance = new Path();
        return this.instance.getPath
    }

    /**
     * @function getPath
     * @description Getter method for path object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    private get getPath() : path.PlatformPath {
        return this.path;
    }
}
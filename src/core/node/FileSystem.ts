'use strict';

import fileSystem from 'fs';

/**
 * @class FileSystem
 * @constructor
 * @description Class FileSystem is used to access the file system 
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class FileSystem {

    private static instance: FileSystem;
    private file_system: typeof fileSystem;
    private constructor() {
        this.file_system = fileSystem;
    }

    /**
     * @function getPathInstance
     * @description Inits or gives back an instance for path class
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Path
    */
    static getFileSystemInstance() : typeof fileSystem {
        if (this.instance) {
            return this.instance.getFileSystem;
        }
        this.instance = new FileSystem();
        return this.instance.getFileSystem;
    }

    /**
     * @function getFileSystem
     * @description Getter method for fs object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    private get getFileSystem() : typeof fileSystem {
        return this.file_system;
    }
}
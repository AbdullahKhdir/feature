'use strict';

import _ from 'lodash';

/**
 * @author Khdir, Abdullah
 * @see www.lodash.com
 * @copyright lodash
*/
export = class Lodash{

    private static lodash_instance: Lodash;
    private lodash: typeof _;
    private constructor() {
        this.lodash = _;
    }

    /**
     * @function getLodashInstance
     * @description Inits or gives back an instance for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns BodyParser
    */
    static getLodashInstance () : typeof _{
        if (this.lodash_instance) {
            return this.lodash_instance.getLodash;
        }
        this.lodash_instance = new Lodash();
        return this.lodash_instance.getLodash
    }

    /**
     * @function getLodash
     * @description Getter method for _ object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns FileSystem
    */
    private get getLodash() : typeof _{
        return this.lodash;
    }
}
'use strict';
/**
 * @author Khdir, Abdullah
 * @see www.lodash.com
 * @copyright lodash
 */
module.exports = class Lodash{
    constructor (_ = require('lodash')) {
        if (typeof this._ !== 'undefined') {
            return this.getLodashInstance();
        }
        this._ = _;
    }

    getLodashInstance () {
        return this._;
    }
}
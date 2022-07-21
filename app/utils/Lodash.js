'use strict';
/**
 * @author Khdir, Abdullah
 * @see www.lodash.com
 * @copyright lodash
 */
module.exports = class Lodash{
    constructor (__ = require('lodash')) {
        if (typeof this.__ !== 'undefined') {
            return this.getLodashInstance();
        }
        this.__ = __;
    }

    getLodashInstance () {
        return this.__;
    }
}
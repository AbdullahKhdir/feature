'use strict';

/**
 * @function isNumber
 * @description Checks if the givin value is a number
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Number number
 * @returns boolean
*/
const is_number = (number) => {
    return /^\d+$/.test(number)
};


module.exports = is_number;
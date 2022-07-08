'use strict';

const is_number = (number) => {
    return /^\d+$/.test(number)
};


module.exports = is_number;
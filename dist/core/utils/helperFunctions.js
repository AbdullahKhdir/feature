"use strict";
var ClassNotFoundException = require("../exception/types/ClassNotFoundException");
module.exports = function getClass(_super) {
    var class_name = _super.constructor.name.toString();
    if (class_name) {
        return class_name;
    }
    throw new ClassNotFoundException("Class ".concat(class_name, " does not exist!"));
};

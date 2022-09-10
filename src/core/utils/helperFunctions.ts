const ClassNotFoundException = require("../exception/types/ClassNotFoundException");

/**
 * @method getClass
 * @description Gets class name of the parent class 
 * @param {Object} _super
 * @return string
*/
export = function getClass(_super: any) {
    let class_name = _super.constructor.name.toString();
    if (class_name) {
        return class_name;
    }
    throw new ClassNotFoundException(`Class ${class_name} does not exist!`)
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstance = exports.checkIfClassOrInstance = exports.isInstanceOf = exports.isConstructor = exports.isClass = exports.getClass = void 0;
var ClassNotFoundException = require("../exception/types/ClassNotFoundException");
/**
 * @method getClass
 * @description Gets class name of the parent class
 * @param {Object} parent
 * @return {string}
 */
function getClass(parent) {
    var class_name = parent.constructor.name.toString();
    if (class_name) {
        return class_name;
    }
    throw new ClassNotFoundException("Class ".concat(class_name, " does not exist!"));
}
exports.getClass = getClass;
/**
 * @method isClass
 * @description checks if the giving parameter is a class
 * @param {Function} input
 * @return {boolean}
 */
function isClass(input) {
    return typeof input === "function" && input.prototype !== undefined;
}
exports.isClass = isClass;
/**
 * @method isConstructor
 * @description checks if the giving parameter is a constructor
 * @param {Function} func
 * @return {boolean}
 */
function isConstructor(func) {
    return typeof func === "function" && func.prototype && func.prototype.constructor === func;
}
exports.isConstructor = isConstructor;
/**
 * @method isInstance
 * @description checks if the giving first parameter is an instance of the second parameter (class reference)
 * @param {T} instance
 * @param {Function} classRef
 * @return {boolean}
 */
function isInstanceOf(instance, classRef) {
    return instance instanceof classRef;
}
exports.isInstanceOf = isInstanceOf;
/**
 * @method checkIfClassOrInstance
 * @description checks if the giving first parameter is an instance or a class of the second parameter (class reference)
 * @param {T | Function} input
 * @param {Function} classRef
 * @return {boolean}
 */
function checkIfClassOrInstance(input, classRef) {
    if (typeof input === "function" && input.prototype !== undefined) {
        return true;
    }
    else if (input instanceof classRef) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkIfClassOrInstance = checkIfClassOrInstance;
/**
 * @method isInstance
 * @description checks if the given input is an instance of any class (via constructor property)
 * @param {T} input - The object to check
 * @return {boolean} - Returns true if input is an instance of a class, otherwise false
 */
function isInstance(input) {
    // Ensure the input is an object or function (since only objects/functions can have constructors)
    if ((typeof input !== "object" && typeof input !== "function") || input === null) {
        return false;
    }
    // Check if the input has a valid constructor function
    return typeof input.constructor === "function";
}
exports.isInstance = isInstance;

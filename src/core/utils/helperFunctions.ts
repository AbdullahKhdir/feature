const ClassNotFoundException = require("../exception/types/ClassNotFoundException");

/**
 * @method getClass
 * @description Gets class name of the parent class
 * @param {Object} parent
 * @return {string}
 */
export function getClass(parent: any): string {
	let class_name = parent.constructor.name.toString();

	if (class_name) {
		return class_name;
	}

	throw new ClassNotFoundException(`Class ${class_name} does not exist!`);
}

/**
 * @method isClass
 * @description checks if the giving parameter is a class
 * @param {Function} input
 * @return {boolean}
 */
export function isClass(input: new (...args: any[]) => any): boolean {
	return typeof input === "function" && input.prototype !== undefined;
}

/**
 * @method isConstructor
 * @description checks if the giving parameter is a constructor
 * @param {Function} func
 * @return {boolean}
 */
export function isConstructor(func: any): boolean {
	return typeof func === "function" && func.prototype && func.prototype.constructor === func;
}

/**
 * @method isInstance
 * @description checks if the giving first parameter is an instance of the second parameter (class reference)
 * @param {T} instance
 * @param {Function} classRef
 * @return {boolean}
 */
export function isInstanceOf<T>(
	instance: T | (new (...args: any[]) => T),
	classRef: new (...args: any[]) => T
): boolean {
	return instance instanceof classRef;
}

/**
 * @method checkIfClassOrInstance
 * @description checks if the giving first parameter is an instance or a class of the second parameter (class reference)
 * @param {T | Function} input
 * @param {Function} classRef
 * @return {boolean}
 */
export function checkIfClassOrInstance<T>(
	input: T | (new (...args: any[]) => T),
	classRef: new (...args: any[]) => T
): boolean {
	if (typeof input === "function" && input.prototype !== undefined) {
		return true;
	} else if (input instanceof classRef) {
		return true;
	} else {
		return false;
	}
}

/**
 * @method isInstance
 * @description checks if the given input is an instance of any class (via constructor property)
 * @param {T} input - The object to check
 * @return {boolean} - Returns true if input is an instance of a class, otherwise false
 */
export function isInstance<T>(input: unknown): boolean {
	// Ensure the input is an object or function (since only objects/functions can have constructors)
	if ((typeof input !== "object" && typeof input !== "function") || input === null) {
		return false;
	}

	// Check if the input has a valid constructor function
	return typeof input.constructor === "function";
}

/*
* #################################################################
*/
/**
 * @method BadMethodCallException
 * @description This is thrown when a function or operation faild 
 * due to missing parameter or config
 * @param {Object} message
 * @return {Error}
*/
function BadMethodCallException(message: any) {
    const error = new Error(message);
    return error;
}
  
BadMethodCallException.prototype = Object.create(Error.prototype);

/*
* #################################################################
*/
/*
* #################################################################
*/
/**
 * @method InternalError
 * @description This error occurs internally in the JS engine, 
 * especially when it has too much data to handle and the stack grows way over its critical limit.
 * This occurs when the JS engine is overwhelmed by too many recursions, too many switch cases, etc
 * @param {Object} message
 * @return {Error}
*/
function InternalError(message: any) {
    const error = new Error(message);
    return error;
}
  
InternalError.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method FileNotFoundException
 * @description When file is not found
 * @param {Object} message
 * @return {Error}
*/
function FileNotFoundException(message: any) {
    const error = new Error(message);
    return error;
}
  
FileNotFoundException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method SQLException
 * @description This type of exception occurs while executing faulty queries on a database related to the SQL syntax
 * @param {Object} message
 * @return {Error}
*/
function SQLException(message: any) {
    const error = new Error(message);
    return error;
}
  
SQLException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method ClassNotFoundException
 * @description This type of exception is thrown when the required class is not found
 * @param {Object} message
 * @return {Error}
*/
function ClassNotFoundException(message: any) {
    const error = new Error(message);
    return error;
}
  
ClassNotFoundException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method IOException
 * @description This type of exception occurs while using file I/O stream operations
 * @param {Object} message
 * @return {Error}
*/
function IOException(message: any) {
    const error = new Error(message);
    return error;
}
  
IOException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method IllegalArgumentException
 * @description This type of exception occurs whenever an inappropriate or incorrect argument is passed to a method
 * @param {Object} message
 * @return {Error}
*/
function IllegalArgumentException(message: any) {
    const error = new Error(message);
    return error;
}
  
IllegalArgumentException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method NullPointerException
 * @description This type of exception occurs when you try to access an object 
 * with the help of a reference variable whose current value is null or empty
 * @param {Object} message
 * @return {Error}
*/
function NullPointerException(message: any) {
    const error = new Error(message);
    return error;
}
  
NullPointerException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method ArrayIndexOutofBound
 * @description This type of exception occurs when you try to access an array with an invalid index value.
 * @param {Object} message
 * @return {Error}
*/
function ArrayIndexOutofBound(message: any) {
    const error = new Error(message);
    return error;
}
  
ArrayIndexOutofBound.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method IllegalStateException
 * @description This type of exception occurs when the state of the environment 
 * does not match the operation being executed
 * @param {Object} message
 * @return {Error}
*/
function IllegalStateException(message: any) {
    const error = new Error(message);
    return error;
}
  
IllegalStateException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method NumberFormatException
 * @description This type of exception occurs 
 * when you pass a string to a method that cannot be converted to a number
 * does not match the operation being executed
 * @param {Object} message
 * @return {Error}
*/
function NumberFormatException(message: any) {
    const error = new Error(message);
    return error;
}
  
NumberFormatException.prototype = Object.create(Error.prototype);
/*
* #################################################################
*/
/**
 * @method ArithmeticException
 * @description This type of exception occurs when you perform an incorrect arithmetic operation.
 * @param {Object} message
 * @return {Error}
*/
function ArithmeticException(message: any) {
    const error = new Error(message);
    return error;
}
  
ArithmeticException.prototype = Object.create(Error.prototype);
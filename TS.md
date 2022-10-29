#### MIGRATING JS TO TS ####

// @ts-ignore
// @ts-nocheck


##### Notes

> TypeScript adds:
> Types
> Type-Casting
> Interfaces
> Generics
> Decorators
> Rich compiler configurtation options
> modern tooling (helps in none Type-Script projects)

___________________________________________________________________________________________________________________________
|Core-Types|Examples                            |Description              
|number    |(10, 1.5, 400,90, 9029210, -389)    |All Numbers, no differentiation between integers or floats
|string    |('String', "String", `String`)      |All text values
|boolean   |(true, false)                       |Just there two. no "truthy" or "falsy" values
|object    |{typescript: 'awesome', v: 4.7}     |Any JS object, more specific types (type of objects) are possible
|array     |['typescript', 4.7]                 |Any JS array, they can be flexible or strict (regarding the element type)
|tuple     |['typescript', 4.7]                 |Added by TypeScript: Fixed-Length Array
|enum      |enum {NEW, OLD}                     |Added by TypeScript: Automatically enumerated global constan identifiers
|any       |*                                   |Any kind of value, no specific type assignment (NOT RECOMMENDED TO USE)
___________________________________________________________________________________________________________________________

```TSConfig
tsc filename.ts --watch //will automatically re-compile the changes
tsc --init              //will create config file, so that only by typing "tsc" all the folder files will be compiled
tsc --watch             //When config file is created, all changes will be saved automatically
```


```TS
//***********************************************************************************************************************\\

const variable = ''!;                           // The ! means the variable will never be NULL

//***********************************************************************************************************************\\

const variable : number = ''!;                  // Assigning data type for variable

//***********************************************************************************************************************\\

const variable : number[] = ''!;                // Assigning array of numbers for variable

//***********************************************************************************************************************\\

const variable : string[] = ''!;                // Assigning array of strings for variable

//***********************************************************************************************************************\\

const variable : any[] = ''!;                   // Assigning array of any for variable

//***********************************************************************************************************************\\

const variable : (string | number)[] = ''!;     // Assigning array of strings or numbers for variable

//***********************************************************************************************************************\\

const variable = ''! as HTMLInputElement;       // Type casting

//***********************************************************************************************************************\\

const variable : object = {                     // Assigning data type for variable
    typscript: 'awesome'                        // But the keys are still not supported via ts
    version:   4.7                              // We have to declate the keys
};

//***********************************************************************************************************************\\

const variable: {                               // Assigning and declaring data type for variable
    typscript: string;
    version:   number;
} = {
    typscript: 'awesome',
    version:   4.7
};

//***********************************************************************************************************************\\

const variable: {                               
    typscript: string;
    version:   number;
    use_cases: [number, string];                // Using tuple data types for fixed array types
} = {
    typscript: 'awesome',
    version:   4.7,
    use_cases: [1, 'In Node']
};

//***********************************************************************************************************************\\

enum Typescript {                               // Using enum as constant data type to better coding exprience
    USECASE  = 'In Node',                                    
    VERSIONS = 4.7
}

function ts() {
    return {Typescript.USECASE, Typescript.VERSIONS};
}

//***********************************************************************************************************************\\

function dataType(num1: number, num2: number = 3) { // Data types for parameters with default (optional)
    return num1 + num2;
}

function types(                                 // Mixing data types for parameters
    input1: number | string,                    // Union types
    input2: number | string                     // Union types
) {
    return num1 + num2;
}

function literalTypes(                          // Using literal types
    is_match: 'This specific string value'
) {
    return is_match === 'This specific string value'
}

function literalTypesWithUnionTyps(             // Using union types with literal types
    is_match: 'does this match' | 'or this'     // Union type
) {
    return is_match === 'or this'
}

//***********************************************************************************************************************\\

type _first_type  = string | number;            // Using "type" keyword for defining union types in a better way
type _second_type = string[] | number[];        // to help understanding complex union typs
type _third_type  = 'match this' | 'or this';

function literalTypesWithUnionTyps2(            // Using union types with literal types
    is_match: _first_type | _second_type        // Union type
) {
    return is_match ? is_match === _third_type : is_match;
}

//***********************************************************************************************************************\\

function data() : string {                      //Assigning return data type for the function
    return 'data';
}

function data() : void {                        //Assigning return data type for the function
    return;
}

function data() : number {                      //Assigning return data type for the function
    return 1;
}

function data() : object {                      //Assigning return data type for the function
    return {};
}


function data() : boolean {                     //Assigning return data type for the function
    return {};
}

function data() : [] {                          //Assigning return data type for the function
    return [];
}

//***********************************************************************************************************************\\

const _getTime : Function;                              //_getTime is a function
const _getTime : () => number;                          //_getTime that accept no parameters and then returns a number
const _getTime : (a: number, b: string) => boolean;     //_getTime that accept number and string 
                                                        //parameters and then returns a boolean
//***********************************************************************************************************************\\

function _returnsCallback(cb: (a: object) => boolean) { //Demo of function with callback and callback return data typs 
    const sanitizing_object = {};
    return cb(sanitizing_object);
}

_returnsCallback(({isAuth: true}) => {
    return true;
})

//***********************************************************************************************************************\\

let user_input : unknown;               //Specifically defining unknown data type to user input
let user_name : string;

user_input = 'some value';              //Assigning a value for the user input

user_name = user_input;                 //This will yield an error

if(typeof user_input === 'string') {
    user_name = user_input;             //This will NOT yield an error
}

//***********************************************************************************************************************\\

function buildAnErrorObject(message: string, code: number) : never { //Function that NEVER returns any values 
    throw {message: message, errCode: code};
}

//***********************************************************************************************************************\\

//When using one parameter without (), then we have to define the function and the function return type 
const printOutput: (value: string | number) => void = output => console.log(output); 

//***********************************************************************************************************************\\

function add(...numbers : string[] | number[]) {                    //Rest parameters
    return numbers.reduce((current_result, current_value) => {
        return current_result + current_value
    }, 0)
}

add(1, 2, 3, 4, '5', "6", 7 ,'8');

//***********************************************************************************************************************\\

type rest_with_tubel_numbers = number[number, number, number];
type rest_with_tubel_strings = string[string, string, string];
function add(...numbers : rest_with_tubel_strings | rest_with_tubel_numbers) {   //Rest parameters with tubel
    return numbers.reduce((current_result, current_value) => {
        return current_result + current_value
    }, 0)
}

add(1, 2, 3); //Only three arguments
        //OR
add('1', '2', '3'); //Only three arguments

//***********************************************************************************************************************\\

class Department {
    name: string;

    constructor(_name: string){
        this.name = _name;
    }

    descripe(this: Department) {
        console.log('Department' + this.name);
    }
}

let accouting = new Department('Accounting');

const _accounting_object = { name: 'Dummy', descripe: accouting.descripe };

_accounting_object.descripe();

//***********************************************************************************************************************\\

class Department {
    public name: string;                          //public property
    s_employees : string[] = [];                  //public property
    private p_employees : string[] = [];          //private property

    constructor(_name: string){
        this.name = _name;
    }

    addEmployee(employee: string) {
        this.s_employees.push(employee)
    }

    printEmployeeInfos() {
        console.log(this.s_employees.length);
        console.log(this.s_employees);
    }
}

const accounting = new Department('Accounting');

accounting.s_employees[1] = 'value_1';      //will work

accounting.p_employees[1] = 'value_1';      //will NOT work

//***********************************************************************************************************************\\

class Department {
    private id: number;
    private name: string;

    constructor(_name: string, _id: number){
        this.name = _name;
        this.id   = _id;
    }
}

//OR

class Department {
    constructor(private _name: string, private readonly _id: number, public _some_param: string | number){
        this.name       = _name;
        this.id         = _id;
        this.some_param = _some_param;
    }
}


//***********************************************************************************************************************\\

class Department {                                  //Inheritence and static access type
    private id: number;
    private name: string;
    static identifier: string;

    constructor(_name: string, _id: number){
        this.name = _name;
        this.id   = _id;
    }

    static createIdentifier(name: string) : object {
        this.identifier = name;
    }
}

class ITDepartment extends Department {
    public admins: string[];
    private id: string;

    get getId() {
        return this.id;
    }

    set setId(value: string) : string {
        this.id = value;
    }

    constructor(id: string, admins: string[]){
        super(id, 1);
        this.admins = admins;
    }
}

const accounting = new ITDepartment('Accounting', ['First_Admin']);

accounting.setId = 'test';      //without (), like normal property
console.log(accounting.getId);  //without (), like normal property

//***********************************************************************************************************************\\

//Abstract classes cannot be intiated only inherited
//When forcing to overrride or implemet methods on inheritence we use abstract classes (enforces overriding existing functionalities)
//Absrtact classes are very usefull when we want to enforce that all classes based on some other classes share some common methods or properties but without the value, so it can be implemented differently on each class that implement that abstract function or that abstract property

class Department {                                  //Inheritence and static access modifier
    private id: number;
    private name: string;
    static identifier: string;

    constructor(_name: string, _id: number){
        this.name = _name;
        this.id   = _id;
    }

    static createIdentifier(name: string) : object {
        this.identifier = name;
    }
}

abstract class ITDepartment extends Department {
    
    constructor(){
    }

    abstract firstMethod(param: string = '') : string; 
    abstract secondMethod() : void; 
}

class AccountingDeparment extends ITDepartment {
    constructor(){
    }

    firstMethod(param: string = '') : string { //Must be implemented or overridden
        return param;
    }

    secondMethod() : void { //Must be implemented or overridden
        return;
    }
}

//***********************************************************************************************************************\\
//Singleton and private constuctor
//Singleton muss always be implemented with private constructor

class Database {
    private static instance: Database;
    private connection: string;

    private constructor(connection : string) {
        this.connection = connection;
    }

    static getDbInstance() : Database {
        if(this.instance || Database.instance) {
            return this.instance || Database.instance
        }
        return this.instance = new Database('some connection string');
    }

    protected query(sql: string) : object | boolean {
        if(this.connection) {
            return {status: '200'};
        }
        return false;
    }
}

const _to_test_equality_db = Database.getDbInstance();
const db                   = Database.getDbInstance();
const query                = db.query();

// will return true, because they are the same only one object created from Database class
console.log(_to_test_equality_db === db);

//***********************************************************************************************************************\\

//Interfaces are used to define a structure to an object

interface Person {
    name: string;
    age: number;

    greet(phrase: string = 'Hello world') : void;
}

type Person = {             //Identical to the usage of interface WHEN NOT WORKING WITH CLASSES
    name: string;
    age: number;

    greet(phrase: string = 'Hello world') : void;
}

let first_user : Person = {
    name: 'Admin',
    age: 30,
    greet(phrase : string) : void {
        console.log(phrase + ' ' + this.name)
    },
}

first_user.greet('Hey there, ');

//***********************************************************************************************************************\\

//Interfaces are often use to share functionality amongst diferent classes not regarding thier concurrent implementations (you cant have concurrent implementations or values inside interfaces ) but regarding the structure or features the class should have
//The difference between Interfaces and Abstract classes is that in interfaces you cant have implementations of methods but in abstract classes you can have implementation of methods and only declaring a method without implementation 

interface AnotherInterface {
    optional_property?: string; //CLASES THAT IMPLEMENTS THIS INTERFACE WONT BE ENFORCED TO IMPLEMENT THIS PROPERTY
}

interface Named {
    //Usage of readonly in interfaces means that the name property must be set only once implemented, and cannot be changed
    readonly name: string; 
}

type CustomTypeAsInterface = {
    _custom_type? : string;
}

interface Greetable extends Named, AnotherInterface {
    
    age?: number;
    greet?(phrase: string = 'Hello world') : void;
}

class Person implements Greetable, AnotherInterface, CustomTypeAsInterface {
    
    name: string;                       //must be implemented
    age?: string;
    constructor(_name: string, _age?: string){
        this.name = _name;
        if(_age) {
            this.age = _age;
        }
    }

    greet(phrase: string) : void {     //must be implemented
        console.log(phrase + ' ' + this.name);
        console.log(this.age || '');
    }
}

let first_user : Greetable = new Person('Admin').greet('Hey there,'); //We can use the interface as type on variables

//***********************************************************************************************************************\\
//Deferentiating between type and interface

type AddFN = (num1 : number, num2: number) => number;

// OR

interface AddFN {       //USING INTERFACE AS FUNCTION TYPE WITH ANONYMOUS FUNCTION
    (num1: number, num2: number) => number;
}

let add : AddFN;

add = (n1: number, n2: number) : number => {
    return n1 + n2;
};

//***********************************************************************************************************************\\
 //protected property is an accessible property in all inherited classes and cannot be edited outside the class or by the inherited classes.
 //private property is an accessible property ONLY the class where it is created and cannot be edited outside an by the inherited classes
//***********************************************************************************************************************\\
// Intersection types

type Admin = {
    name: string;
    privileges: string[];
};

type Employee = {
    name: string;
    start_date: Date;
}

type Elevated_employee = Admin & Employee;

const e1: Elevated_employee = {
    name: 'User',
    privileges: ['Admin'],
    start_date: new Date()
}
//***********************************************************************************************************************\\
//Type guards

if (typeof new String('') === 'string') {

}

if ('property' in object) {

}

if (new Car() instanceof Car) {

}

//***********************************************************************************************************************\\
// Indexed properties

interface ErrorsTypes {
    id: string;
    [prop: string]: string;
}

//***********************************************************************************************************************\\
// Functions overload

function add(n1: number, n2: number): number;
function add(n1: number, n2: number) {
    if (typeof n1 === 'string' && typeof n2 === 'string') {
        return n1.toString() + n2.toString();
    }
    return n1 + n2;
}

add(2, 2);
add('2', '2');

//***********************************************************************************************************************\\
```
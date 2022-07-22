'use strict';

const { isEmpty } = require("lodash");
const Lodash     = require("../../app/utils/Lodash");
const Db         = require("../database/Db");
const FileSystem = require("../node/FileSystem");
const Path       = require("../node/Path");

/**
 * @class QueryBuilder
 * @constructor Model and Built Query
 * @description To build a complex queries using predefined methods
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @extends Db
 * @example
   this.product is the model name
   this.product.selectModel(Product)
    .where()
    .custom(
        'id in (select node.products.id from node.products where price != 0)'
    )
    ._and_()
    .contains('description', '1')
    ._and_()
    .nesting()
    .isNotNull('price')
    ._or_()
    .notContains('title', 'cart')
    .closeNesting()
    .done()
    .then(([rows, fields]) => {
        console.log(rows);
    })
    .catch(err => console.log(err));
*/
module.exports = class QueryBuilder extends Db {

    #mysql;
    #query;
    #model;
    #table;
    #columns;
    constructor(model_name = null, query = null, table = null, columns = []) {
        const mysql = super().mysql;
        this.#mysql = mysql;
        this.__      = new Lodash().__;
        
        this.#model   = model_name;
        this.#query   = query;
        this.#table   = table;
        this.#columns = columns;
    }

    /**
     * @method getDb
     * @description Returns an instance of the database initiated object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Db Object
    */
    getDb() {
        return this.#mysql;
    }

    /**
     * @method getModel
     * @description Returns an instance of the initiated model
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Model Object
    */
    getModel() {
        return this.#model ?? this.model;
    }

    /**
     * @method escapeValue
     * @description Escapes user input
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string value
     * @param number value
     * @returns User escaped values
    */
    escapeValue (value) {
        return this.getDb().escape(value);
    }

    /**
     * @method selectModel
     * @description Selects all from the model's table and returns a string with sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Class} modul_name
     * @returns QueryBuilder
    */
    selectModel(modul_name) {
        if (!this.__.isNull(modul_name)) {
            if (this.__.isFunction(modul_name)) {
                this.path        = Object.assign(new Path().path);
                this.file_system = Object.assign(new FileSystem().fs);
                let modules_directory = this.path.join(__dirname, '..', '..', 'app', 'models');
                const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
                if (this.__.isEmpty(level_one) || !this.__.isObject(level_one)) {
                    throw new Error ('Unable to scan models directory');
                } else {
                    level_one.forEach((file) => {
                        let is_dir  = file.isDirectory();
                        let is_file = file.isFile();
                        const model = modul_name.toString().match(/ (\w+)/)[1];
                            
                        if (is_file) {
                            const searched_model = this.__.replace(file.name.toString(), '.js', '');
                            if (searched_model === model) {
                                let file_name    = model;
                                let required_model   = require(
                                    '../../app/models/'+directory_name+'/'+file_name+'.js'
                                );
                                this.#model   = new required_model();
                                this.#table   = this.#model.table;
                                this.#columns = this.#model.columns;
                                this.#query   = `SELECT * FROM ${this.#model.table} `;
                            }
                        } else if (is_dir) {
                            let directory_name = file.name;
                            const level_two = this.file_system.readdirSync(modules_directory+'/'+file.name, { withFileTypes: true });
                            if (this.__.isEmpty(level_two) || !this.__.isObject(level_two)) {
                                throw new Error ('Unable to scan models directory');
                            }
                            level_two.forEach((file) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const searched_model = this.__.replace(file.name.toString(), '.js', '');
                                    if (searched_model === model) {
                                        let file_name    = model;
                                        let required_model   = require(
                                            '../../app/models/'+directory_name+'/'+file_name+'.js'
                                        );
                                        this.#model = new required_model();
                                        this.#table   = this.#model.table;
                                        this.#columns = this.#model.columns;
                                        this.#query = `SELECT * FROM ${this.#model.table} `;
                                    }
                                }
                            });
                        }
                    });
                }
            } else if (this.__.isString(modul_name)) {
                this.path        = Object.assign(new Path().path);
                this.file_system = Object.assign(new FileSystem().fs);
                let modules_directory = this.path.join(__dirname, '..', '..', 'app', 'models');
                const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
                if (this.__.isEmpty(level_one) || !this.__.isObject(level_one)) {
                    throw new Error ('Unable to scan models directory');
                } else {
                    level_one.forEach((file) => {
                        let is_dir  = file.isDirectory();
                        let is_file = file.isFile();
                        const model = modul_name;
                            
                        if (is_file) {
                            const searched_model = this.__.replace(file.name.toString(), '.js', '');
                            if (searched_model === model) {
                                let file_name    = model;
                                let required_model   = require(
                                    '../../app/models/'+directory_name+'/'+file_name+'.js'
                                );
                                this.#model   = new required_model();
                                this.#table   = this.#model.table;
                                this.#columns = this.#model.columns;
                                this.#query   = `SELECT * FROM ${this.#model.table} `;
                            }
                        } else if (is_dir) {
                            let directory_name = file.name;
                            const level_two = this.file_system.readdirSync(modules_directory+'/'+file.name, { withFileTypes: true });
                            if (this.__.isEmpty(level_two) || !this.__.isObject(level_two)) {
                                throw new Error ('Unable to scan models directory');
                            }
                            level_two.forEach((file) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const searched_model = this.__.replace(file.name.toString(), '.js', '');
                                    if (searched_model === model) {
                                        let file_name    = model;
                                        let required_model   = require(
                                            '../../app/models/'+directory_name+'/'+file_name+'.js'
                                        );
                                        this.#model   = new required_model();
                                        this.#table   = this.#model.table;
                                        this.#columns = this.#model.columns;
                                        this.#query   = `SELECT * FROM ${this.#model.table} `;
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
        
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, this.#table, this.#columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\
    
    /**
     * @method done
     * @description Ends a query with a comma
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Promise
    */
    done() {
        if (!this.__.isEmpty(this.#query)) {
            this.#query = this.#query + ';';
        }
        return !!this.#query ? this.#executeQuery(this.#query) : !!this.#query;
    }

    //###########################\\
    //###########################\\
    
    /**
     * @method _and_
     * @description Adds an and operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    _and_() {
        if (!this.__.isEmpty(this.#query)) {
            this.#query = this.#query + ' AND ';
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, this.#table, this.#columns) : !!this.#query;
    }
    
    /**
     * @method _or_
     * @description Adds an or operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    _or_() {
        if (!this.__.isEmpty(this.#query)) {
            this.#query = this.#query + ' OR ';
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, this.#table, this.#columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method is
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    is(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        const _value = this.escapeValue(value);

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} = ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} = ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method isNot
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    isNot(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} != ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} != ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(model, this.#query, table, columns) : !!this.#query;
    }
    

    //###########################\\
    //###########################\\
    
    /**
     * @method contains
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    contains(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method notContains
     * @description Adds a condition to where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    notContains(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method startsWith
     * @description Checks if column starts with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    startsWith(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method notStartsWith
     * @description Checks if column does not start with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    notStartsWith(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method endsWith
     * @description Checks if column ends with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    endsWith(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = value.concat('%');
        const _value = this.escapeValue(value);
        
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method notEndsWith
     * @description Checks if column does not end with givin value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    notEndsWith(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = value.concat('%');
        const _value = this.escapeValue(value);

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method custom
     * @description Executes a sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string SQL
     * @returns QueryBuilder
    */
    custom(sub_query) {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(sub_query)) {
            if (this.__.isEmpty(sub_query)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }

        const custom_query = this.escapeValue(sub_query).replaceAll("'", '').replaceAll('"', '');
        
        if (!this.__.isEmpty(custom_query)) {
            this.#query = `${this.#query} ${custom_query} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ( ${custom_query} )`;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method reset
     * @description Emptys the sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Boolean
    */
    reset() {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }
        
        this.#query = '';
        return !this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method isNull
     * @description Checks if column is null
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns QueryBuilder
    */
    isNull(col) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} IS NULL `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NULL `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method isNotNull
     * @description Checks if column is not null
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns QueryBuilder
    */
    isNotNull(col) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.#table ?? this.table ;
            columns = this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.model;

            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} IS NOT NULL `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NOT NULL `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method matchesPattern
     * @description Checks if column matches givin regex
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string regex
     * @returns QueryBuilder
    */
    matchesPattern(col, regex) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(regex)) {
            if (this.__.isEmpty(regex)) {
                return false;
            }
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} REGEXP ${regex} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} REGEXP ${regex} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method notMatchesPattern
     * @description Checks if column does not matche givin regex
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string regex
     * @returns QueryBuilder
    */
    notMatchesPattern(col, regex) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(regex)) {
            if (this.__.isEmpty(regex)) {
                return false;
            }
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT REGEXP ${regex} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT REGEXP ${regex} `;
        }
        
        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method matchesSearchTerm
     * @description Checks if the search term matches
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    matchesSearchTerm(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value.concat('%'));
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method notMatchesSearchTerm
     * @description Checks if the search term does not matche
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    notMatchesSearchTerm(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value.concat('%'));
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method from
     * @description Adds range to column >= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    from(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} >= ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method to
     * @description Adds range to column <= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    to(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} <= ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method isLessThan
     * @description Adds less operator to column < Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    isLessThan(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} < ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} < ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method isGreaterThan
     * @description Adds greater operator to column > Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    isGreaterThan(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} > ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} > ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method isLessThanEqual
     * @description Adds less or equals operators to column <= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    isLessThanEqual(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} <= ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method isGreaterThan
     * @description Adds greater or equal operators to column >= Value
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string value
     * @param number value
     * @returns QueryBuilder
    */
    isGreaterThanEqual(col, value) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(value)) {
            if (this.__.isEmpty(value)) {
                return false;
            }
        } else if (!this.__.isNumber(value)) {
            return false;
        }

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} >= ${_value} `;
        } else {
            this.#query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method where
     * @description Adds Where clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    where() {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }

        if (!this.__.isEmpty(this.#query)) {
            this.#query = `${this.#query} WHERE `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method groupBy
     * @description Adds GroupBy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns QueryBuilder
    */
    groupBy(col) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query)) {
            this.#query = `${this.#query} GROUP BY ${col.toString()} `;
        } else {
            this.#query = `SELECT * FROM ${table} GROUP BY ${col.toString()} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }


    /**
     * @method having
     * @description Adds Having clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string condition
     * @returns QueryBuilder
    */
    having(condition) {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(condition)) {
            if (this.__.isEmpty(condition)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }

        if (!this.__.isEmpty(this.#query) && !this.__.isEmpty(condition)) {
            if (this.#query.search('GROUP BY') === -1 && this.#query.search('group by') === -1) {
                throw new Error('Using "Having" key word requires using "Group By" key word');
            }
            let _condition = this.escapeValue(condition).replaceAll("'", '').replaceAll('"', '');
            this.#query = `${this.#query} Having ${_condition} `;
            return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
        }
        return false;
    }

    /**
     * @method orderBy
     * @description Adds GroupBy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @param string sort
     * @returns QueryBuilder
    */
    orderBy(col, sort = 'ASC') {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            object  = Object.values(Object.keys(columns));
            model   = this.#model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            object  = Object.values(Object.keys(columns));
            model   = this.model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this.#query)) {
            this.#query = `${this.#query} ORDER BY ${col.toString()} ${sort} `;
        } else {
            this.#query = `SELECT * FROM ${table} ORDER BY ${col.toString()} ${sort} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method nesting
     * @description Opens up a new bracket to nest conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    nesting() {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }

        if (!this.__.isEmpty(this.#query)) {
            this.#query = `${this.#query} ( `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    /**
     * @method closeNesting
     * @description Closes an opend bracket of a nested conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    closeNesting() {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.#model) {
            table   = this.#model.table ?? this.#table ?? this.table;
            columns = this.#model.columns ?? this.#columns ?? this.columns;
            model   = this.#model;
        } else {
            table   = this.__.isEmpty(this.#table) ? this.table : this.#table;
            columns = this.__.isEmpty(this.#columns) ? this.columns : this.#columns
            model   = this.model;
        }

        if (!this.__.isEmpty(this.#query)) {
            this.#query = `${this.#query} ) `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query, table, columns) : !!this.#query;
    }

    //###########################\\
    //###########################\\

    /**
     * @method executeQuery
     * @description Async query executer method 
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string built_query
     * @returns Promise
    */
    #executeQuery(built_query = this.#query) {
        if (!this.__.isNull(built_query)) {
            if (this.__.isString(built_query)) {
                if (!this.__.isEmpty(built_query)) {
                    return (async () => {
                        return await this.executeQuery(built_query).then(result => {
                            if (result) {
                                return result;
                            }
                        });
                    })()
                }
            }
        }
    }
}
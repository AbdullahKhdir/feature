'use strict';

import Lodash from "../../app/utils/Lodash";
import Db from "../database/Db";
import FileSystem from "../node/FileSystem";
import Path from "../node/Path";
import { Singleton } from "../Singleton/Singleton";

/**
 * @class QueryBuilder
 * @constructor Model and Built Query
 * @description To build a complex queries using predefined methods
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
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
    .catch(err => {throw err});
*/
export = class QueryBuilder {

    protected _mysql;
    protected db: Db;
    protected _query: any;
    protected _model: any;
    protected _table: any;
    protected _columns: any;
    protected path: any;
    protected file_system: any;
    protected __: typeof import('lodash');
    constructor(model_name = null, query = null, table = null, columns = []) {
        this._mysql   = Singleton.getDbSession();
        this.db       = Singleton.getDb();
        this._model   = model_name;
        this._query   = query;
        this._table   = table;
        this._columns = columns;
        this.path        = Singleton.getPath();
        this.file_system = Singleton.getFileSystem();
        this.__          = Singleton.getLodash();
    }

    /**
     * @method getDb
     * @description Returns an instance of the database initiated object
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Db Object
    */
    getDb() {
        return this._mysql;
    }

    /**
     * @method getModel
     * @description Returns an instance of the initiated model
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Model Object
    */
    getModel() {
        return this._model;
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
    escapeValue (value: any) {
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
    selectModel(modul_name: any) : boolean | QueryBuilder {
        if (!this.__.isNull(modul_name)) {
            if (this.__.isFunction(modul_name)) {
                
                let modules_directory = this.path.join(__dirname, '..', '..', 'app', 'models');
                const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
                if (this.__.isEmpty(level_one)) {
                    throw new Error ('Unable to scan models directory');
                } else {
                    level_one.forEach((file: any) => {
                        let is_dir  = file.isDirectory();
                        let is_file = file.isFile();
                        // @ts-ignore: Object is possibly 'null'.
                        const model = modul_name.toString().match(/ (\w+)/)[1];
                            
                        if (is_file) {
                            const searched_model = this.__.replace(file.name.toString(), '.js', '');
                            if (searched_model === model) {
                                let file_name    = model;
                                let required_model   = require(
                                    '../../app/models/'+'/'+file_name+'.js'
                                );
                                this._model   = new required_model();
                                this._table   = this._model.table;
                                this._columns = this._model.columns;
                                this._query   = `SELECT * FROM ${this._model.table} `;
                            }
                        } else if (is_dir) {
                            let directory_name = file.name;
                            const level_two: any = this.file_system.readdirSync(modules_directory+'/'+file.name, { withFileTypes: true });
                            if (this.__.isEmpty(level_two)) {
                                throw new Error ('Unable to scan models directory');
                            }
                            level_two.forEach((file: any) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const searched_model = this.__.replace(file.name.toString(), '.js', '');
                                    if (searched_model === model) {
                                        let file_name    = model;
                                        let required_model   = require(
                                            '../../app/models/'+directory_name+'/'+file_name+'.js'
                                        );
                                        this._model = new required_model();
                                        this._table   = this._model.table;
                                        this._columns = this._model.columns;
                                        this._query = `SELECT * FROM ${this._model.table} `;
                                    }
                                }
                            });
                        }
                    });
                }
            } else if (this.__.isString(modul_name)) {
                let modules_directory = this.path.join(__dirname, '..', '..', 'app', 'models');
                const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
                if (this.__.isEmpty(level_one)) {
                    throw new Error ('Unable to scan models directory');
                } else {
                    level_one.forEach((file: any) => {
                        let is_dir  = file.isDirectory();
                        let is_file = file.isFile();
                        const model = modul_name;
                            
                        if (is_file) {
                            const searched_model = this.__.replace(file.name.toString(), '.js', '');
                            if (searched_model === model) {
                                let file_name    = model;
                                let required_model   = require(
                                    '../../app/models/'+'/'+file_name+'.js'
                                );
                                this._model   = new required_model();
                                this._table   = this._model.table;
                                this._columns = this._model.columns;
                                this._query   = `SELECT * FROM ${this._model.table} `;
                            }
                        } else if (is_dir) {
                            let directory_name = file.name;
                            const level_two = this.file_system.readdirSync(modules_directory+'/'+file.name, { withFileTypes: true });
                            if (this.__.isEmpty(level_two)) {
                                throw new Error ('Unable to scan models directory');
                            }
                            level_two.forEach((file: any) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const searched_model = this.__.replace(file.name.toString(), '.js', '');
                                    if (searched_model === model) {
                                        let file_name    = model;
                                        let required_model   = require(
                                            '../../app/models/'+directory_name+'/'+file_name+'.js'
                                        );
                                        this._model   = new required_model();
                                        this._table   = this._model.table;
                                        this._columns = this._model.columns;
                                        this._query   = `SELECT * FROM ${this._model.table} `;
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
        
        return !!this._query ? new QueryBuilder(this._model, this._query, this._table, this._columns) : !!this._query;
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
        if (!this.__.isEmpty(this._query)) {
            this._query = this._query + ';';
        }
        return !!this._query ? this._executeQuery(this._query) : !!this._query;
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
        if (!this.__.isEmpty(this._query)) {
            this._query = this._query + ' AND ';
        }
        return !!this._query ? new QueryBuilder(this._model, this._query, this._table, this._columns) : !!this._query;
    }
    
    /**
     * @method _or_
     * @description Adds an or operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
    */
    _or_() {
        if (!this.__.isEmpty(this._query)) {
            this._query = this._query + ' OR ';
        }
        return !!this._query ? new QueryBuilder(this._model, this._query, this._table, this._columns) : !!this._query;
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
    is(col: any, value: any) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : ''
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        const _value = this.escapeValue(value);

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} = ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} = ${_value} `;
        }

        return !!this._query ? new QueryBuilder(model, this._query, table, columns) : !!this._query;
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
    isNot(col: any, value: any) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} != ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} != ${_value} `;
        }

        return !!this._query ? new QueryBuilder(model, this._query, table, columns) : !!this._query;
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
    contains(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }
        
        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    notContains(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    startsWith(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }
        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    notStartsWith(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value);
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    endsWith(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = value.concat('%');
        const _value = this.escapeValue(value);
        
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    notEndsWith(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = value.concat('%');
        const _value = this.escapeValue(value);

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    custom(sub_query: string) {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(sub_query)) {
            if (this.__.isEmpty(sub_query)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }

        let custom_query: any = this.escapeValue(sub_query);
        custom_query = custom_query.replaceAll("'", '').replaceAll('"', '');
        
        if (!this.__.isEmpty(custom_query)) {
            this._query = `${this._query} ${custom_query} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ( ${custom_query} )`;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }
        
        this._query = '';
        return !this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    isNull(col: any) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} IS NULL `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NULL `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
    }

    /**
     * @method isNotNull
     * @description Checks if column is not null
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns QueryBuilder
    */
    isNotNull(col: any) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this._table;
            columns = this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;

            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} IS NOT NULL `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} IS NOT NULL `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    matchesPattern(col: any, regex: any) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} REGEXP ${regex} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} REGEXP ${regex} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    notMatchesPattern(col: any, regex: any) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} NOT REGEXP ${regex} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT REGEXP ${regex} `;
        }
        
        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    matchesSearchTerm(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value.concat('%'));
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} LIKE ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    notMatchesSearchTerm(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        value = '%'.concat(value.concat('%'));
        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} NOT LIKE ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} NOT LIKE ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    from(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} >= ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    to(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} <= ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    isLessThan(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} < ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} < ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    isGreaterThan(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} > ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} > ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    isLessThanEqual(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} <= ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} <= ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    isGreaterThanEqual(col: any, value: string) {
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        const _value = this.escapeValue(value);
        if (!this.__.isEmpty(this._query) && object.includes(col.toString())) {
            this._query = `${this._query} ${col.toString()} >= ${_value} `;
        } else {
            this._query = `SELECT * FROM ${table} WHERE ${col.toString()} >= ${_value} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }

        if (!this.__.isEmpty(this._query)) {
            this._query = `${this._query} WHERE `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
    }

    /**
     * @method groupBy
     * @description Adds GroupBy
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string column
     * @returns QueryBuilder
    */
    groupBy(col: any) {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query)) {
            this._query = `${this._query} GROUP BY ${col.toString()} `;
        } else {
            this._query = `SELECT * FROM ${table} GROUP BY ${col.toString()} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
    }

    /**
     * @method having
     * @description Adds Having clause
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param string condition
     * @returns QueryBuilder
    */
    having(condition: string) {
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(condition)) {
            if (this.__.isEmpty(condition)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }

        if (!this.__.isEmpty(this._query) && !this.__.isEmpty(condition)) {
            if (this._query.search('GROUP BY') === -1 && this._query.search('group by') === -1) {
                throw new Error('Using "Having" key word requires using "Group By" key word');
            }
            let _condition : any = this.escapeValue(condition);
            _condition = _condition.replaceAll("'", '').replaceAll('"', '');
            this._query = `${this._query} Having ${_condition} `;
            return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    orderBy(col: any, sort = 'ASC') {
        let object  = null;
        let table   = null;
        let columns = null;
        let model   = null;

        if (this.__.isString(col)) {
            if (this.__.isEmpty(col)) {
                return false;
            }
        }

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            
            if (!object.includes(col.toString())) {
                throw new Error('The giving column '+col.toString()+' does not exist in the table '+ table);
            }
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            object  = Object.values(Object.keys(columns));
            model   = this._model;
            
            if (this.__.isEmpty(Object.keys(columns))) {
                return false;
            }
            if (!object.includes(col.toString())) {
                throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ table);
            }
        }

        if (!this.__.isEmpty(this._query)) {
            this._query = `${this._query} ORDER BY ${col.toString()} ${sort} `;
        } else {
            this._query = `SELECT * FROM ${table} ORDER BY ${col.toString()} ${sort} `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }

        if (!this.__.isEmpty(this._query)) {
            this._query = `${this._query} ( `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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

        if (this._model) {
            table   = this._model.table ?? this._table;
            columns = this._model.columns ?? this._columns;
            model   = this._model;
        } else {
            table   = this.__.isEmpty(this._table) ? this._table : '';
            columns = this.__.isEmpty(this._columns) ? this._columns : '';
            model   = this._model;
        }

        if (!this.__.isEmpty(this._query)) {
            this._query = `${this._query} ) `;
        }

        return !!this._query ? new QueryBuilder(this._model, this._query, table, columns) : !!this._query;
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
    protected _executeQuery(built_query = this._query) {
        if (!this.__.isNull(built_query)) {
            if (this.__.isString(built_query)) {
                if (!this.__.isEmpty(built_query)) {
                    return (async () => {
                        return await this.db.executeQuery(built_query).then(result => {
                            if (result) {
                                return result;
                            }
                        }).catch(err => Promise.reject(SQLException(err)));;
                    })()
                }
            }
        }
    }
}
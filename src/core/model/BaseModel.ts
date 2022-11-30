'use strict';

import Db from '../database/Db';
import BadMethodCallException from '../exception/types/BadMethodCallException';
import LogicException from '../exception/types/LogicException';
import SQLException from '../exception/types/SQLException';
import { Singleton } from '../Singleton/Singleton';
import getClass from '../utils/helperFunctions';
import QueryBuilder from './QueryBuilder';

/**
 * @class BaseModel
 * @constructor
 * @extends QueryBuilder
 * @description Class BaseModel is used to prepare suitable environment to build queries for the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
export = class BaseModel extends QueryBuilder {
    //**************************************************************************
    //* QUERY Types (Comparing Constants)
    //**************************************************************************

    /** QUERY-Type "SELECT" */
    protected QUERY_TYPE_SELECT = 1;

    /** QUERY-Type "INSERT" */
    protected QUERY_TYPE_INSERT = 2;

    /** QUERY-Type "UPDATE" */
    protected QUERY_TYPE_UPDATE = 3;

    /** QUERY-Type "DELETE" */
    protected QUERY_TYPE_DELETE = 4;

    //**************************************************************************
    //* Restriction of the executable actions
    //**************************************************************************

    /**
    * Determines whether INSERT can be executed (can be overridden by inheritance)
    * @var bool
    */
    private _can_create = false;

    /**
    * @method can_create
    * @description Getter can_create for the private property _can_create
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns bool
    */
    get can_create() {
        return this._can_create;
    }

    /**
    * @method can_create
    * @description Setter can_create for the private property _can_create
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Boolean} bool
    * @returns bool
    */
    set can_create(bool) {
        if (bool !== true && bool !== false) {
            this._can_create;
        }
        this._can_create = bool;
    }

    /**
     * determines whether UPDATE can be executed (can be overridden by inheritance)
    * @var bool
    */
    private _can_update = false;

    /**
    * @method can_update
    * @description Getter _can_update for the private property _can_update
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns bool
    */
    get can_update() {
        return this._can_update;
    }

    /**
    * @method _can_update
    * @description Setter _can_update for the private property _can_update
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Boolean} bool
    * @returns bool
    */
    set can_update(bool) {
        if (bool !== true && bool !== false) {
            this._can_update;
        }
        this._can_update = bool;
    }
 
    /**
    * determines whether DELETE can be executed (can be overridden by inheritance)
    * @var bool
    */
    private _can_delete = false;

    /**
    * @method can_delete
    * @description Getter can_delete for the private property _can_delete
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns bool
    */
    get can_delete() {
        return this._can_delete;
    }

    /**
    * @method can_delete
    * @description Setter can_delete for the private property _can_delete
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Boolean} bool
    * @returns bool
    */
    set can_delete(bool) {
        if (bool !== true && bool !== false) {
            this._can_delete;
        }
        this._can_delete = bool;
    }

    //**************************************************************************
    // List data types
    //**************************************************************************

    /**
    * List of numeric data types
    * @var string[]
    */
    protected _numerical_types = ['float', 'double', 'tinyint', 'smallint','mediumint','int','bigint'];

    /**
    * List of integer data types
    * @var string[]
    */
    protected _integer_types   = ['tinyint', 'smallint','mediumint','int','bigint'];
 
    /**
    * List of floating point data types
    * @var string[]
    */
    protected _floating_point_types = ['float', 'double', 'decimal'];
 
    /**
    * List of string data types
    * @var string[]
    */
    protected _string_types = ["char", "varchar", "text", 'mediumtext', 'longtext'];
 
    /**
    * List of markup data types
    * @var string[]
    */
    protected _markup_types = ['xml'];
 
    /**
    * All DateTime data types
    * @var string[]
    */
    protected _datetime_types = ['date', 'datetime', 'timestamp', 'time'];

    //**************************************************************************
    // Default-Formats
    //**************************************************************************

    /** @var string Default-Format for Date */
    protected DEFAULT_DATE_FORMAT = 'd.m.Y';

    /** @var string Default format for a point in time */
    protected DEFAULT_DATETIME_FORMAT = 'd.m.Y H:i';

    /** @var string Default format for a time */
    protected DEFAULT_TIME_FORMAT     = 'H:i';

    /** @var string Datetime-Format for ISO 8601 */
    protected DATETIME_FORMAT_ISO_8601 = 'Y-m-d\TH:i:s';

    /**
    * Table for the model (in the constructor or set via inheritance)
    * @var string
    */
    private __table: any;

    /**
    * @method table
    * @description Getter table for the private property _table
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns string
    */
    get table() {
        return this.__table;
    }
    
    /**
    * @method table
    * @description Setter table for the private property _table
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {String} string
    * @returns string
    */
    set table(string) {
        if (this.__.isEmpty(string)) {
            this.__table;
        }
        this.__table = string;
    }

    /**
    * Primary key of the table (set automatically in the constructor)
    * @var string
    */
     private _primary_key: any;

    /**
    * @method primary_key
    * @description Getter primary_key for the private property _primary_key
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns string|number
    */
    get primary_key() {
        return this._primary_key;
    }
        
    /**
    * @method primary_key
    * @description Setter primary_key for the private property _primary_key
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {String} id
    * @param {Number} id
    * @returns string|number
    */
    set primary_key(id) {
        if (this.__.isEmpty(id)) {
            this._primary_key;
        }
        this._primary_key = id;
    }

    /**
    * Human-readable name (overridden by inheritance, available via getVerboseName, will be translated)
    * @var string|null
    */
    _verbose_name = null;

    /**
    * @method verbose_name
    * @description Getter verbose_name for the private property _verbose_name
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns string
    */
    get verbose_name() {
        return this._verbose_name;
    }
            
    /**
    * @method verbose_name
    * @description Setter verbose_name for the private property _verbose_name
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {String} string
    * @returns string
    */
    set verbose_name(string) {
        if (this.__.isEmpty(string)) {
            this._verbose_name;
        }
        this._verbose_name = string;
    }

    /**
    * Specification of the columns
    *
    * Construction:
    *     column_name: {
    *         label:    "human-readable name",
    *         references: {  //Foreign key, data is loaded automatically
    *             name:   "Name for field in returned array",
    *             class:  "Class of the modul pointed by the foreign key",
    *             table:  "Table name of the table to which the foreign key points",
    *             column: "Column to which the FK points (default: primary key)"
    *         },
    *         required: not empty (will be validated), // true or false
    *     }
    *
    * @var object<string,object>
    */
     private __columns: any;

    /**
    * @method columns
    * @description Getter columns for the private property _columns
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns object
    */
    get columns() {
        return this.__columns;
    }
                
    /**
    * @method columns
    * @description Setter columns for the private property _columns
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Object} object
    * @returns string
    */
    set columns(object) {
        if (this.__.isEmpty(object)) {
            this.__columns;
        }
        if (typeof this.__columns === 'undefined') {
            this.__columns = object;
        }
    }

    /**
    * make reverse references available in the result
    +
    * Configuration format:
    *
    * this.reverse_references: {
    *     '[Index im Result]' : {
    *         'table':       "Table name",
    *         'class':       "Model name",
    *         #should be foreign_key#
    *         'column': "Foreign key column in the other model",
    *         setting: {
    *             #should be where_foreign_key#
    *             where_column: "Foreign key comparison with other columns of other models",
    *             where_table:  "Table name"
    *         }
    *     }
    * }
    *
    * @var object<string,object>
    */
    _reverse_references: any;

    /**
    * @method reverse_references
    * @description Getter reverse_references for the private property _reverse_references
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns object
    */
    get reverse_references() {
        return this._reverse_references;
    }
                    
    /**
    * @method reverse_references
    * @description Setter reverse_references for the private property _reverse_references
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Object} object
    * @returns string
    */
    set reverse_references(object) {
        if (this.__.isEmpty(object)) {
            this._reverse_references;
        }
        this._reverse_references = object;
    }

    /**
    * Illustration of generic references (table and PK in 2 columns)
    *
    * Format:
    *  this.generic_references: {
    *      [Index im Result]' : {
    *          'pk_column':    "Name of the column in which the PK of the object is stored"
    *          'table_column': "Name of the column in which the table of the object is stored"
    *      }
    *  }
    *
    * @var array<string,object>
    */
    _generic_references: any;

    /**
    * @method generic_references
    * @description Getter generic_references for the private property _generic_references
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @returns object
    // TODO: implement generic_references logic
    */
     get generic_references() {
        return this._generic_references;
    }
                    
    /**
    * @method generic_references
    * @description Setter generic_references for the private property _generic_references
    * @version 1.0.0
    * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
    * @param {Object} object
    * @returns string
    // TODO: implement generic_references logic
    */
    set generic_references(object) {
        if (this.__.isEmpty(object)) {
            this._generic_references;
        }
        this._generic_references = object;
    }

    /**
    * Not found code constant for mysql2 
    * @var NOT_FOUND
    */
    protected NOT_FOUND = -1;

    /**
    * Reference auf die QueryBuilder constructor
    * @var parent
    */
    protected parent: any;
    protected model: any;
    protected __mysql: any;
    protected override db: Db;

    constructor() {
        super();
        this.parent  = super();
        this.model   = getClass(this.parent);
        this.__mysql = this.getDb();
        this.db      = Singleton.getDb();
    }

    //**************************************************************************
    // Protected functions
    //**************************************************************************
    /**
     * @function _validateTable
     * @description validates the table in the database
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns boolean
    */
    protected _validateTable(table: any) : Promise<any>{
        if (typeof this.table !== 'undefined') {
            return this.db.validateTable(table);
        }
        return Promise.reject(new Error('table does not exist in the database!'));
    }

    //**************************************************************************
    // DB functions
    //**************************************************************************
    /**
     * @function delete
     * @description deletes one data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param Number id
     * @param Object id
     * @returns Promise
    */
    delete(id: any, table = this.__table) : Promise<any> {
        if (this.can_delete === true) {
            if (this.__.isString(id)) {
                id = +id;
            }
    
            if (this.__.isEmpty(table)) {
                return Promise.reject(new BadMethodCallException('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                .then(result => {
                    if (!result) {
                        return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                    }
                    if (this.__.isObject(id)) {
                        let where_clause: any = '';
                        for (const key in id) {
                            if (Object.hasOwnProperty.call(id, key)) {
                                // @ts-ignore
                                where_clause = where_clause + key + ' = ' + this._mysql.escape(id[key]) + ' AND ';
                            }
                        }
                        if (this.__.isString(where_clause) && !this.__.isEmpty(where_clause)) {
                            const where_clause_length = where_clause.length;
                            where_clause = where_clause.substring(0, where_clause_length - 4);
                        }
                        where_clause = this._mysql.escape(where_clause)
                        where_clause =  where_clause.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                        
                        return (async () => {
                            return await this.db.executeModelQuery(`DELETE FROM ${table} WHERE ?;`, id);
                        })()
                    } else if (this.__.isNumber(id)) {
                        return (async () => {
                            return await this.db.executeModelQuery(`DELETE FROM ${table} WHERE ID = ?;`, id);
                        })()
                    } else {
                        return Promise.reject(new SQLException('Primary key must not be empty!'));
                    }
                })
                .then(result => {
                    return result;
                })
                .catch(() => {return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`))});
            }
        } else {
            return Promise.reject(new LogicException('User can not delete!'));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function deleteAll
     * @description deletes all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    deleteAll(table = this.__table) : Promise<any> {
        if (this.can_delete === true) {
            if (this.__.isEmpty(table)) {
                return Promise.reject(new BadMethodCallException('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                .then(result => {
                    if (!result) {
                        return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                    }
                    return (async () => {
                        return await this.db.executeModelQuery(
                            `
                            DELETE 
                            FROM ${table} 
                            ORDER BY ID ASC
                            `
                        );
                    })()
                })
                .then(result => {
                    return result;
                })
                .catch(() => {return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`))});
            }
        } else {
            return Promise.reject(new LogicException('User can not delete!'));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function filter
     * @description filters data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {Object} sql_query
     * @param {String} limit
     * @param {String} table
     * @returns Promise
    */
    async filter(sql_query: any = null, limit: number | string | null = null, table = this.__table) {
        if (this.__.isEmpty(table)) {
            return await Promise.reject(new BadMethodCallException('Table must not be empty!'));
        }

        if (table !== undefined && table !== null) {
            const is_valid_table = await this._validateTable(table)
            if (is_valid_table === true) {
                if (sql_query == null || typeof sql_query === 'undefined') {
                    return await this.all(table);
                }

                if (this.__.isObject(sql_query) && this.__.isEmpty(table) === false) {
                    
                    let where_clause: any = '';
                    for (const key in sql_query) {
                        if (Object.hasOwnProperty.call(sql_query, key)) {
                            // @ts-ignore
                            where_clause = where_clause + key + ' = ' + this._mysql.escape(sql_query[key]) + ' AND ';
                        }
                    }
                    if (this.__.isString(where_clause) && !this.__.isEmpty(where_clause)) {
                        const where_clause_length = where_clause.length;
                        where_clause = where_clause.substring(0, where_clause_length - 4);
                    }
                    where_clause = this._mysql.escape(where_clause)
                    where_clause =  where_clause.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    
                    let sql = `SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC`;
                    if (limit != null && !this.__.isNaN(limit)) {
                        var _limit = ` LIMIT ${limit.toString()}`;
                        sql += _limit;
                    }
                    
                    return await this.db.executeModelQuery(sql)
                    .then(([rows, fields]) => {
                        if (!this.__.isEmpty(rows)) {
                            for (const key in this.columns) {
                                // @ts-ignore 
                                rows['reverse_table_name'] = table;
                                let column_name = key;
                                if (typeof this.columns[column_name].references !== 'undefined') {
                                    let is_constraint    = this.columns[column_name].references;
                                    let constraint_table = this.columns[column_name].references.table;
                                    if (typeof this.columns[column_name].references.column !== 'undefined') {
                                        // @ts-ignore 
                                        rows[column_name] = (async () => {
                                            return {// @ts-ignore 
                                                [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch((err: any) => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                            }
                                        })(); 
                                    } else {
                                        // @ts-ignore 
                                        rows[column_name]    = this.getTablePrimaryKey(constraint_table)
                                        // @ts-ignore 
                                        .then((id) => {
                                            return (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch((err: any) => Promise.reject(new SQLException(`Column "${id}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                                }
                                            })()
                                        })
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    }
                                }
                            }
                            return rows;
                        }
                    })
                    .then((rows: any) => {
                        if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                            for (const key in this.reverse_references) {
                                let reverse_table = this.reverse_references[key].table;
                                let reverse_col   = this.reverse_references[key].column;
                                let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_column : '';
                                let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_table : '';
                                let reverse_name  = key;
                                if (typeof rows !== 'undefined') {
                                    rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                    .then((id) =>
                                        {
                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                // @ts-ignore 
                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                    return this.getTablePrimaryKey(where_tbl)
                                                    .then((_id) => {
                                                        const _statement = where_tbl && where_col && reverse_table ? 
                                                                        'SELECT * FROM '+reverse_table+' '+
                                                                        'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                        'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                        // @ts-ignore 
                                                                        'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                        ')' : '';
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                                }
                                            } else {
                                                return this.getTablePrimaryKey(reverse_table)
                                                .then((TABLE_ID: string) => {
                                                    const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.db.executeModelQuery(sql)
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                        }
                                                    })()
                                                })
                                                .catch(err => Promise.reject(err));
                                            }
                                        }
                                    )
                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                } else {
                                    continue;   
                                }
                            }
                        }
                        return rows;
                    })
                    .catch(err => Promise.reject(new SQLException(err)))
                }
                
                if (this.__.isString(sql_query) && !this.__.isEmpty(table) && !this.__.isNumber(sql_query)) {
                    // @ts-ignore
                    sql_query = this._mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    let sql = `SELECT * FROM ${table} WHERE ${sql_query} ORDER BY ID ASC`;
                    if (limit != null && !this.__.isNaN(limit)) {
                        var _limit = ` LIMIT ${limit.toString()}`;
                        sql += _limit;
                    }
                    return await this.db.executeModelQuery(sql)
                    .then(([rows, fields]) => {
                        if (!this.__.isEmpty(rows)) {
                            for (const key in this.columns) {
                                // @ts-ignore 
                                rows['reverse_table_name'] = table; 
                                let column_name = key;
                                let is_constraint = this.columns[column_name].references;
                                if (typeof is_constraint !== 'undefined') {
                                    let constraint_table = this.columns[column_name].references.table;
                                    if (typeof this.columns[column_name].references.column !== 'undefined') {
                                        // @ts-ignore 
                                        rows[column_name] = (async () => {
                                            return {// @ts-ignore 
                                                [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch(err => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                            }
                                        })(); 
                                    } else {
                                        // @ts-ignore 
                                        rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                        .then((id) => {
                                            return (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                }
                                            })()
                                        })
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    }
                                }
                            }
                            return rows;
                        }
                    })
                    .then((rows: any) => {
                        if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                            for (const key in this.reverse_references) {
                                let reverse_table = this.reverse_references[key].table;
                                let reverse_col   = this.reverse_references[key].column;
                                let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_column : '';
                                let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_table : '';
                                let reverse_name  = key;
                                if (typeof rows !== 'undefined') {
                                    rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                    .then((id) =>
                                        {
                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                    return this.getTablePrimaryKey(where_tbl)
                                                    .then((_id) => {
                                                        const _statement = where_tbl && where_col && reverse_table ? 
                                                                        'SELECT * FROM '+reverse_table+' '+
                                                                        'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                        'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                        'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                        ')' : '';
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                                }
                                            } else {
                                                return this.getTablePrimaryKey(reverse_table)
                                                .then((TABLE_ID: string) => {
                                                    const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.db.executeModelQuery(sql)
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                        }
                                                    })()
                                                })
                                                .catch(err => Promise.reject(err));
                                            }
                                        }
                                    )
                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                } else {
                                    continue;   
                                }
                            }
                        }
                        return rows;
                    })
                    .catch(err => Promise.reject(new SQLException(err)));
                }
        
                if (!this.__.isNaN(sql_query) && this.__.isString(sql_query)) {
                    sql_query = +sql_query;
                }
                
                if (!this.__.isNaN(sql_query) && !this.__.isEmpty(table)) {
                    let _table_id;
                    try {
                        _table_id = await this.getTablePrimaryKey(table)
                    } catch (error) {
                        return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`))
                    }

                    var sql = `SELECT * FROM ${table} where ${'id'} = ? ORDER BY ID ASC`;
                    if (limit != null && !this.__.isNaN(limit)) {
                        var _limit = ` LIMIT ${limit.toString()}`;
                        sql += _limit;
                    }
                    
                    return await this.db.executeModelQuery(sql, [sql_query])
                    .then(([rows, fields]) => {
                        if (!this.__.isEmpty(rows)) {
                            for (const key in this.columns) {
                                // @ts-ignore 
                                rows['reverse_table_name'] = table; 
                                let column_name = key;
                                let is_constraint = this.columns[column_name].references;
                                if (typeof is_constraint !== 'undefined') {
                                    let constraint_table = this.columns[column_name].references.table;
                                    if (typeof this.columns[column_name].references.column !== 'undefined') {
                                        // @ts-ignore 
                                        rows[column_name] = (async () => {
                                            return {// @ts-ignore 
                                                [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch(err => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                            }
                                        })(); 
                                    } else {
                                        // @ts-ignore 
                                        rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                        .then((id) => {
                                            return (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                }
                                            })()
                                        })
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    }
                                }
                            }
                        }
                        return rows;
                    })
                    .then((rows: any) => {
                        if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                            for (const key in this.reverse_references) {
                                let reverse_table = this.reverse_references[key].table;
                                let reverse_col   = this.reverse_references[key].column;
                                let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_column : '';
                                let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_table : '';
                                let reverse_name  = key;
                                if (typeof rows !== 'undefined') {
                                    rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                    .then((id) =>
                                        {
                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                    return this.getTablePrimaryKey(where_tbl)
                                                    .then((_id) => {
                                                        const _statement = where_tbl && where_col && reverse_table ? 
                                                                        'SELECT * FROM '+reverse_table+' '+
                                                                        'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                        'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                        'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                        ')' : '';
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                                }
                                            } else {
                                                return this.getTablePrimaryKey(reverse_table)
                                                .then((TABLE_ID: string) => {
                                                    const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.db.executeModelQuery(sql)
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                        }
                                                    })()
                                                })
                                                .catch(err => Promise.reject(err));
                                            }
                                        }
                                    )
                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                } else {
                                    continue;   
                                }
                            }
                        }
                        return rows;
                    })
                    .catch(err => Promise.reject(new SQLException(err)));
                }
            } else {
                return await Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
            }
        }
        // return await Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function get
     * @description gets only one data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Object} sql_query
     * @returns Promise
    */
    async get(sql_query: any, table = this.__table) : Promise<any> {
        // if (this.model) {
        //     var _model = Singleton.getModel(this.model.toString())
        //     // console.log(_model._columns);
        //     // console.log(this._columns);
        //     this.columns = _model._columns;
        //     // console.log(this.columns);
        // }
        if (this.__.isEmpty(table)) {
            return Promise.reject(new BadMethodCallException('Table must not be empty!'));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
            .then(result => {
                if (!result) {
                    return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                }

                if (this.__.isObject(sql_query) && this.__.isEmpty(table) === false) {
                    let where_clause: any = '';
                    for (const key in sql_query) {
                        if (Object.hasOwnProperty.call(sql_query, key)) {
                            // @ts-ignore 
                            where_clause = where_clause + key + ' = ' + this._mysql.escape(sql_query[key]) + ' AND ';
                        }
                    }
                    if (this.__.isString(where_clause) && !this.__.isEmpty(where_clause)) {
                        const where_clause_length = where_clause.length;
                        where_clause = where_clause.substring(0, where_clause_length - 4);
                    }
                    where_clause = this._mysql.escape(where_clause)
                    where_clause = where_clause.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    
                    return (async () => {
                        return await this.db.executeModelQuery(`SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC LIMIT 1`)
                        .then(([rows, fields]) => {
                            if (!this.__.isEmpty(rows)) {
                                for (const key in this.columns) {
                                    // @ts-ignore 
                                    rows['reverse_table_name'] = table; 
                                    let column_name = key;
                                    let is_constraint = this.columns[column_name].references;
                                    if (typeof is_constraint !== 'undefined') {
                                        let constraint_table = this.columns[column_name].references.table;
                                        if (typeof this.columns[column_name].references.column !== 'undefined') {
                                            // @ts-ignore 
                                            rows[column_name] = (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                                }
                                            })(); 
                                        } else {
                                            // @ts-ignore 
                                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                            .then((id) => {
                                                return (async () => {
                                                    return {// @ts-ignore 
                                                        [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                    }
                                                })()
                                            })
                                            .catch((err: any) => Promise.reject(new SQLException(err)));
                                        }
                                    }
                                }
                                return rows;
                            }
                        })
                        .then((rows: any) => {
                            if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                                for (const key in this.reverse_references) {
                                    let reverse_table = this.reverse_references[key].table;
                                    let reverse_col   = this.reverse_references[key].column;
                                    let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_column : '';
                                    let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_table : '';
                                    let reverse_name  = key;
                                    if (typeof rows !== 'undefined') {
                                        rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                        .then((id) =>
                                            {
                                                if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                    // @ts-ignore 
                                                    if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                        return this.getTablePrimaryKey(where_tbl)
                                                        .then((_id) => {
                                                            const _statement = where_tbl && where_col && reverse_table ? 
                                                                            'SELECT * FROM '+reverse_table+' '+
                                                                            'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                            'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                            // @ts-ignore 
                                                                            'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                            ')' : '';
                                                            return (async () => {
                                                                return {
                                                                    [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => Promise.reject(new SQLException(err)))
                                                                }
                                                            })()
                                                        })
                                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                                    }
                                                } else {
                                                    return this.getTablePrimaryKey(reverse_table)
                                                    .then((TABLE_ID: string) => {
                                                        const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(sql)
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch(err => Promise.reject(err));
                                                }
                                            }
                                        )
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    } else {
                                        continue;   
                                    }
                                }
                            }
                            return rows;
                        })
                        .catch(err => Promise.reject(new SQLException(err)))
                    })()
                }

                if (this.__.isString(sql_query) && !this.__.isEmpty(table) && this.__.isNaN(sql_query)) {
                    sql_query = this._mysql.escape(sql_query)
                    sql_query = sql_query.replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
                    return (async () => {
                        return await this.db.executeModelQuery(
                            `
                            SELECT * 
                            FROM ${table} 
                            where ${sql_query}
                            ORDER BY ID ASC LIMIT 1
                            `
                        )
                        .then(([rows, fields]) => {
                            if (!this.__.isEmpty(rows)) {
                                for (const key in this.columns) {
                                    // @ts-ignore 
                                    rows['reverse_table_name'] = table; 
                                    let column_name = key;
                                    let is_constraint = this.columns[column_name].references;
                                    if (typeof is_constraint !== 'undefined') {
                                        let constraint_table = this.columns[column_name].references.table;
                                        if (typeof this.columns[column_name].references.column !== 'undefined') {
                                            // @ts-ignore 
                                            rows[column_name] = (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                }
                                            })(); 
                                        } else {
                                            // @ts-ignore 
                                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                            .then((id) => {
                                                return (async () => {
                                                    return {// @ts-ignore 
                                                        [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                    }
                                                })()
                                            })
                                            .catch((err: any) => Promise.reject(new SQLException(err)));
                                        }
                                    }
                                }
                                return rows;
                            }
                        })
                        .then((rows: any) => {
                            if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                                for (const key in this.reverse_references) {
                                    let reverse_table = this.reverse_references[key].table;
                                    let reverse_col   = this.reverse_references[key].column;
                                    let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_column : '';
                                    let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_table : '';
                                    let reverse_name  = key;
                                    if (typeof rows !== 'undefined') {
                                        rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                        .then((id) =>
                                            {
                                                if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                    // @ts-ignore 
                                                    if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                        return this.getTablePrimaryKey(where_tbl)
                                                        .then((_id) => {
                                                            const _statement = where_tbl && where_col && reverse_table ? 
                                                                            'SELECT * FROM '+reverse_table+' '+
                                                                            'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                            'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                            // @ts-ignore 
                                                                            'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                            ')' : '';
                                                            return (async () => {
                                                                return {
                                                                    [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => Promise.reject(new SQLException(err)))
                                                                }
                                                            })()
                                                        })
                                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                                    }
                                                } else {
                                                    return this.getTablePrimaryKey(reverse_table)
                                                    .then((TABLE_ID: string) => {
                                                        const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(sql)
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch(err => Promise.reject(err));
                                                }
                                            }
                                        )
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    } else {
                                        continue;   
                                    }
                                }
                            }
                            return rows;
                        })
                        .catch(err => Promise.reject(new SQLException(err)))
                    })()
                }

                if (!this.__.isNaN(sql_query) && this.__.isString(sql_query)) {
                    sql_query = +sql_query;
                }
                
                if (!this.__.isNaN(sql_query) && this.__.isEmpty(table) === false) {
                    return (async () => {
                        return await this.db.executeModelQuery(
                            `
                                SELECT * 
                                FROM ${table} 
                                where id = ?
                                ORDER BY ID ASC LIMIT 1
                            `
                            ,
                            [sql_query]
                        )
                        .then(([rows, fields]) => {
                            if (!this.__.isEmpty(rows)) {
                                for (const key in this.columns) {
                                    // @ts-ignore 
                                    rows['reverse_table_name'] = table; 
                                    let column_name = key;
                                    let is_constraint = this.columns[column_name].references;
                                    if (typeof is_constraint !== 'undefined') {
                                        let constraint_table = this.columns[column_name].references.table;
                                        if (typeof this.columns[column_name].references.column !== 'undefined') {
                                            // @ts-ignore 
                                            rows[column_name] = (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                                }
                                            })(); 
                                        } else {
                                            // @ts-ignore 
                                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                            .then((id) => {
                                                return (async () => {
                                                    return {// @ts-ignore 
                                                        [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                    }
                                                })()
                                            })
                                            .catch((err: any) => Promise.reject(new SQLException(err)));
                                        }
                                    }
                                }
                            }
                            return rows;
                        })
                        .then((rows: any) => {
                            if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                                for (const key in this.reverse_references) {
                                    let reverse_table = this.reverse_references[key].table;
                                    let reverse_col   = this.reverse_references[key].column;
                                    let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_column : '';
                                    let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                    this.reverse_references[key].setting.where_table : '';
                                    let reverse_name  = key;
                                    if (typeof rows !== 'undefined') {
                                        rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                        .then((id) =>
                                            {
                                                if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                    // @ts-ignore 
                                                    if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                        return this.getTablePrimaryKey(where_tbl)
                                                        .then((_id) => {
                                                            const _statement = where_tbl && where_col && reverse_table ? 
                                                                            'SELECT * FROM '+reverse_table+' '+
                                                                            'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                            'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                            // @ts-ignore 
                                                                            'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                            ')' : '';
                                                            return (async () => {
                                                                return {
                                                                    [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => Promise.reject(new SQLException(err)))
                                                                }
                                                            })()
                                                        })
                                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                                    }
                                                } else {
                                                    return this.getTablePrimaryKey(reverse_table)
                                                    .then((TABLE_ID: string) => {
                                                        const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(sql)
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch(err => Promise.reject(err));
                                                }
                                            }
                                        )
                                        .catch((err: any) => Promise.reject(new SQLException(err)));
                                    } else {
                                        continue;   
                                    }
                                }
                            }
                            return rows;
                        })
                        .catch(err => Promise.reject(new SQLException(err)))
                    })()

                }
            })
            .then(result => {
                return result;
            })
            .catch(() => Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`)));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function all
     * @description gets all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    async all(table = this.__table) : Promise<any>{
        if (this.__.isEmpty(table) && !this.__.isString(table)) {
            return Promise.reject(new BadMethodCallException('Table must not be empty!'));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
            .then(result => {
                if (!result) {
                    return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                }

                return (async () => {
                    return await this.db.executeModelQuery(
                    `
                    SELECT * 
                    FROM ${table} 
                    ORDER BY ID ASC
                    `
                    )
                    .then(([rows, fields]) => {
                        if (!this.__.isEmpty(rows)) {
                            for (const key in this.columns) {
                                // @ts-ignore 
                                rows['reverse_table_name'] = table; 
                                let column_name = key;
                                let is_constraint = this.columns[column_name].references;
                                if (typeof is_constraint !== 'undefined') {
                                    let constraint_table = this.columns[column_name].references.table;
                                    if (typeof this.columns[column_name].references.column !== 'undefined') {
                                        // @ts-ignore 
                                        rows[column_name] = (async () => {
                                            return {// @ts-ignore 
                                                [is_constraint.name] : await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${this.columns[column_name].references.column} = '${rows[0][column_name]}'`)
                                                                        .then(([rows, fields]) => rows)
                                                                        .catch(err => Promise.reject(new SQLException(`Column "${this.columns[column_name].references.column}" does not exist in table "${constraint_table}"! \n Error: ${err}`)))
                                            }
                                        })(); 
                                    } else {
                                        // @ts-ignore 
                                        rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                        .then((id) => {
                                            return (async () => {
                                                return {// @ts-ignore 
                                                    [is_constraint.name]: await this.db.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                            .then(([rows, fields]) => rows)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                };
                                            })()
                                        }).catch((err: any) => Promise.reject(new SQLException(err)));
                                    }
                                }
                            }
                        }
                        return rows;
                    })
                    .then((rows: any) => {
                        if (typeof this.reverse_references === 'object' && typeof this.reverse_references !== 'undefined') {
                            for (const key in this.reverse_references) {
                                let reverse_table = this.reverse_references[key].table;
                                let reverse_col   = this.reverse_references[key].column;
                                let where_col = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_column : '';
                                let where_tbl = typeof this.reverse_references[key].setting !== 'undefined' ? 
                                                this.reverse_references[key].setting.where_table : '';
                                let reverse_name  = key;
                                if (typeof rows !== 'undefined') {
                                    rows[reverse_name] = this.getTablePrimaryKey(reverse_table)
                                    .then((id) =>
                                        {
                                            if (where_col && typeof rows['reverse_table_name'] !== 'undefined') {
                                                // @ts-ignore 
                                                if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this.__.isEmpty(typeof rows[0][where_col])) {
                                                    return this.getTablePrimaryKey(where_tbl)
                                                    .then((_id) => {
                                                        const _statement = where_tbl && where_col && reverse_table ? 
                                                                        'SELECT * FROM '+reverse_table+' '+
                                                                        'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                        'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                        // @ts-ignore 
                                                                        'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                        ')' : '';
                                                        return (async () => {
                                                            return {
                                                                [reverse_name]: await this.db.executeModelQuery(_statement) 
                                                                            .then(([results, fields]) => results)
                                                                            .catch(err => Promise.reject(new SQLException(err)))
                                                            }
                                                        })()
                                                    })
                                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                                }
                                            } else {
                                                return this.getTablePrimaryKey(reverse_table)
                                                .then((TABLE_ID: string) => {
                                                    const sql = `SELECT * FROM ${reverse_table} where ${reverse_col} = ${rows[0][TABLE_ID]}`;
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.db.executeModelQuery(sql)
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => Promise.reject(new SQLException(err)))
                                                        }
                                                    })()
                                                })
                                                .catch(err => Promise.reject(err));
                                            }
                                        }
                                    )
                                    .catch((err: any) => Promise.reject(new SQLException(err)));
                                } else {
                                    continue;   
                                }
                            }
                        }
                        return rows;
                    })
                    .catch(err => Promise.reject(new SQLException(err)))
                })();
            })
            .then(result => {
                return result;
            })
            .catch(() => Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`)));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function create
     * @description create a data record
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Object} values
     * @returns Promise
    */
    create(values: any, table = this.__table) : Promise<any>{
        if (this.can_create === true) {
            if (this.__.isEmpty(table) && !this.__.isString(table)) {
                return Promise.reject(new BadMethodCallException('Table must not be empty!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                .then(result => {
                    if (!result) {
                        return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                    }
                    if (!this.__.isObject(values) || this.__.isEmpty(values)) {
                        return Promise.reject(new SQLException('No columns neither values are specified!'));
                    }
                    
                    return (async () => {
                        return await this.db.executeModelQuery(`INSERT INTO ${table} SET ?;`, values);
                    })();
                })
                .then(result => {
                    return result;
                })
                .catch(() => Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`)));
            }
        } else {
            return Promise.reject(new LogicException('User can not create!'));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function update
     * @description updates data record(s)
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Array} values
     * @param {Object} where
     * @returns Promise
    */
    update(values: any, where = null, table = this.__table) : Promise<any>{
        if (this.can_delete === true) {
            if (this.__.isEmpty(table) && !this.__.isString(table)) {
                return Promise.reject(new BadMethodCallException('No columns neither values are specified!'));
            }
            
            if (!this.__.isObject(values) || this.__.isEmpty(values)) {
                return Promise.reject(new SQLException('No columns neither values are specified!'));
            }
            if (table !== undefined && table !== null) {
                return this._validateTable(table)
                .then((result: any) => {
                    if (!result) {
                        return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                    }
                    if (where !== null && typeof where !== 'undefined') {
                        if (this.__.isObject(where)) {
                            return (async () => {
                                return await this.db.executeModelQuery(`UPDATE ${table} SET ? where ? ;`, [values, where]);
                            })()
                        } else if (!this.__.isNaN(where)) {
                            // @ts-ignore 
                            where = +where;
                            return (async () => {
                                return await this.db.executeModelQuery(`UPDATE ${table} SET ? where id = ? ;`, [values, where]);                    
                            })()
                        } else {
                            // @ts-ignore 
                            where = this.escapeValue(where);
                            return (async () => {
                                return await this.db.executeModelQuery(`UPDATE ${table} SET ? where id = ? ;`, [values, where]);
                            })()
                        }
                    }
                            return Promise.reject(new SQLException('Query could not be executed!'));
                })
                .then(result => {
                    return result;
                })
                .catch(() => Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`)));
            }
        } else {
            return Promise.reject(new LogicException('User can not update!'));
        }
                return Promise.reject(new SQLException('Query could not be executed!'));
    }

    /**
     * @function getTablePrimaryKey
     * @description gets the table primary key
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
    */
    getTablePrimaryKey(table = this.__table) : Promise<any> {
        const length         = table.toString().length;
        const database_index = table.indexOf('.');
        if (database_index === this.NOT_FOUND) {
            console.log(
                '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' +
                ` Please write the database name in your table variable "this.table = ${table}" in the module class (${this.model}) `
                +'\u00D7' + '\u00D7' + '\u001b[0m'
            );
            return Promise.reject(new Error(`Please write the database name in your table variable "this.table = ${table}" in the module class (${this.model})`));
        }
        if (table !== undefined && table !== null) {
            return this._validateTable(table)
            .then(result => {
                if (!result) {
                    return Promise.reject(new SQLException(`The Table ${table} does not exist in the database!`));
                }
                const database       = table.substr(0, database_index);
                const table_name     = table.substr(database_index + 1, length)
                if (this.primary_key !== undefined && this.primary_key !== null) {
                    return this.primary_key;
                }
                return (async () => {
                    return await  this.db.executeModelQuery(
                        "select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE "+ 
                        "where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='"+table_name+"' "+
                        "AND TABLE_SCHEMA='"+database+"'"
                        // @ts-ignore 
                    ).then(([rows, fields]) => rows[0].COLUMN_NAME)
                    .catch(err => Promise.reject(new SQLException(err)))
                })();
            })
            .then(result => {
                return result;
            })
            .catch((err: any) => Promise.reject(new SQLException(`The Table ${table} does not exist in the database!, Error: ${err}`)));
        }
        return Promise.reject(new SQLException('Query could not be executed!'));
    }
}
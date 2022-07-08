'use strict';

const Db = require('../database/node/Db');
const is_number = require('../../app/utils/RegEx');
const Lodash = require('../../app/utils/Lodash');
const { query } = require('express');
const QueryBuilder = require('./QueryBuilder');

/**
 * @class BaseModel
 * @constructor
 * @extends QueryBuilder
 * @description Class BaseModel is used to prepare suitable environment to the models
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
*/
module.exports = class BaseModel extends QueryBuilder {
    
    #NOT_FOUND = -1;
    #parent;
    constructor() {
        const parent = super();
        this.#parent = parent;
        this.model   = this.#parent.constructor.name.toString();
        this._ = new Lodash()._;
        this.mysql  = this.getDb();
    }

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
    delete(id, table = this.table) {
        if (this._.isString(id)) {
            id = +id;
        }

        if (this._.isEmpty(table)) {
            return false;
        }

        if (this._.isObject(id)) {
            return this.mysql.query(`DELETE FROM ${table} WHERE ?;`, id);
        } else if (this._.isNumber(id)) {
            return this.mysql.query(`DELETE FROM ${table} WHERE ID = ?;`, id);
        } else {
            return false;
        }
    }

    /**
     * @function deleteAll
     * @description deletes all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
     */
    deleteAll(table = this.table) {
        if (this._.isEmpty(table)) {
            return false;
        }

        return this.mysql.query(
            `
             DELETE 
             FROM ${table} 
             ORDER BY ID ASC
            `
        );
    }

    /**
     * @function filter
     * @description filters data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @param {Object} sql_query
     * @returns Promise
     */
    filter(sql_query = null, table = this.table) {
        if (this._.isEmpty(table)) {
            return [];
        }
        
        if (this._.isObject(sql_query) && this._.isEmpty(table) === false) {
            let where_clause = '';
            for (const key in sql_query) {
                if (Object.hasOwnProperty.call(sql_query, key)) {
                    where_clause = where_clause + key + ' = ' + this.mysql.escape(sql_query[key]) + ' AND ';
                }
            }
            if (this._.isString(where_clause) && !this._.isEmpty(where_clause)) {
                const where_clause_length = where_clause.length;
                where_clause = where_clause.substring(0, where_clause_length - 4);
            }
            where_clause = this.mysql.escape(where_clause).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
            return this.mysql.query(
                {
                    sql: `SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC`, 
                }
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }

        if (this._.isString(sql_query) && !this._.isEmpty(table)) {
            sql_query = this.mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
            return this.mysql.query(
                `
                 SELECT * 
                 FROM ${table} 
                 where ${sql_query}
                 ORDER BY ID ASC
                `
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }

        if (!this._.isNaN(sql_query) && this._.isString(sql_query)) {
            sql_query = +sql_query;
        }
        
        if (!this._.isNaN(sql_query) && this._.isEmpty(table) === false) {
            return this.mysql.query(
                `
                 SELECT * 
                 FROM ${table} 
                 where id = ?
                 ORDER BY ID ASC
                `
                ,
                [sql_query]
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }

        if ((this._.isEmpty(sql_query) && !this._.isNaN(sql_query)) || sql_query == null) {
            return this.all(table);
        }
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
    get(sql_query, table = this.table) {
        if (this._.isEmpty(table)) {
            return [];
        }

        if (this._.isObject(sql_query) && this._.isEmpty(table) === false) {
            let where_clause = '';
            for (const key in sql_query) {
                if (Object.hasOwnProperty.call(sql_query, key)) {
                    where_clause = where_clause + key + ' = ' + this.mysql.escape(sql_query[key]) + ' AND ';
                }
            }
            if (this._.isString(where_clause) && !this._.isEmpty(where_clause)) {
                const where_clause_length = where_clause.length;
                where_clause = where_clause.substring(0, where_clause_length - 4);
            }
            where_clause = this.mysql.escape(where_clause).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
            
            return this.mysql.query(
                {
                    sql: `SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC LIMIT 1`, 
                }
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }

        if (this._.isString(sql_query) && !this._.isEmpty(table)) {
            sql_query = this.mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
            return this.mysql.query(
                `
                 SELECT * 
                 FROM ${table} 
                 where ${sql_query}
                 ORDER BY ID ASC LIMIT 1
                `
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }

        if (!this._.isNaN(sql_query) && this._.isString(sql_query)) {
            sql_query = +sql_query;
        }
        
        if (!this._.isNaN(sql_query) && this._.isEmpty(table) === false) {
            return this.mysql.query(
                `
                 SELECT * 
                 FROM ${table} 
                 where id = ?
                 ORDER BY ID ASC LIMIT 1
                `
                ,
                [sql_query]
            ).then(([rows, fields]) => {
                if (!this._.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => (
                                {
                                    [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                            .then(([rows, fields]) => rows)
                                                            .catch(err => err)
                                } 
                            ));
                        }
                    }
                    return rows;
                }
             })
             .then(rows => {
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
                                        if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                            return this.getTablePrimaryKey(where_tbl)
                                            .then((_id) => {
                                                const _statement = where_tbl && where_col && reverse_table ? 
                                                                'SELECT * FROM '+reverse_table+' '+
                                                                'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                                'SELECT '+_id+' FROM '+where_tbl+' '+
                                                                'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                                ')' : '';
                                                return {
                                                    [reverse_name]: this.mysql.query(_statement) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            });
                                        }
                                    } else {
                                        return {
                                            [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                        .then(([results, fields]) => results)
                                                        .catch(err => err)
                                        }
                                    }
                                }
                            );
                        } else {
                            continue;   
                        }
                    }
                }
                return rows;
             })
             .catch(error => error);
        }
    }

    /**
     * @function all
     * @description gets all data records
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
     */
    all(table = this.table) {
        if (this._.isEmpty(table) && !this._.isString(table)) {
            return [];
        }
        return this.mysql.query(
            `
             SELECT * 
             FROM ${table} 
             ORDER BY ID ASC
            `
        ).then(([rows, fields]) => {
            if (!this._.isEmpty(rows)) {
                for (const key in this.columns) {
                    rows['reverse_table_name'] = this.table; 
                    let column_name = key;
                    let is_constraint = this.columns[column_name].references;
                    if (typeof is_constraint !== 'undefined') {
                        let constraint_table = this.columns[column_name].references.table;
                        rows[column_name] = this.getTablePrimaryKey(constraint_table)
                        .then((id) => (
                            {
                                [is_constraint.name]: this.mysql.query(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                        .then(([rows, fields]) => rows)
                                                        .catch(err => err)
                            } 
                        ));
                    }
                }
                return rows;
            }
         })
         .then(rows => {
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
                                    if (typeof rows[0][where_col] !== 'undefined' || typeof rows[0][where_col] !== null || !this._.isEmpty(typeof rows[0][where_col])) {
                                        return this.getTablePrimaryKey(where_tbl)
                                        .then((_id) => {
                                            const _statement = where_tbl && where_col && reverse_table ? 
                                                            'SELECT * FROM '+reverse_table+' '+
                                                            'WHERE '+reverse_table+'.'+reverse_col+' IN ('+
                                                            'SELECT '+_id+' FROM '+where_tbl+' '+
                                                            'WHERE '+where_col+' = '+rows[0][where_col]+' '+
                                                            ')' : '';
                                            return {
                                                [reverse_name]: this.mysql.query(_statement) 
                                                            .then(([results, fields]) => results)
                                                            .catch(err => err)
                                            }
                                        });
                                    }
                                } else {
                                    return {
                                        [reverse_name]: this.mysql.query(`SELECT * FROM ${reverse_table}`) 
                                                    .then(([results, fields]) => results)
                                                    .catch(err => err)
                                    }
                                }
                            }
                        );
                    } else {
                        continue;   
                    }
                }
            }
            return rows;
         })
         .catch(error => error);
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
    create(values, table = this.table) {
        if (this._.isEmpty(table) && !this._.isString(table)) {
            return false;
        }
        
        if (!this._.isObject(values) || this._.isEmpty(values)) {
            return false;
        }
        
        return this.mysql.query(`INSERT INTO ${table} SET ?;`, values);
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
    update(values, where = null, table = this.table) {
        if (this._.isEmpty(table) && !this._.isString(table)) {
            return false;
        }
        
        if (!this._.isObject(values) || this._.isEmpty(values)) {
            return false;
        }
        
        if (where !== null && typeof where !== 'undefined') {
            if (this._.isObject(where)) {
                return this.mysql.query(`UPDATE ${table} SET ? where ? ;`, [values, where ?? '1=1']);
            } else if (!this._.isNaN(where)) {
                where = +where;
                return this.mysql.query(`UPDATE ${table} SET ? where id = ? ;`, [values, where ?? '1=1']);
            } else {
                return this.mysql.query(`UPDATE ${table} SET ? where id = ? ;`, [values, where ?? '1=1']);
            }
        }
        return false;
    }

    /**
     * @function getTablePrimaryKey
     * @description gets the table primary key
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @param {String} table
     * @returns Promise
     */
    getTablePrimaryKey(table = this.table) {
        const length         = table.toString().length;
        const database_index = table.indexOf('.');
        if (database_index === this.NOT_FOUND) {
            console.log(
                '\u001b[' + 31 + 'm' + '\u00D7' + '\u00D7' +
                ` Please write the database name in your table variable "this.table = ${this.table}" in the module class (${this.model}) `
                +'\u00D7' + '\u00D7' + '\u001b[0m'
            );
            throw new Error(`Please write the database name in your table variable "this.table = ${this.table}" in the module class (${this.model})`);
        }
        const database       = table.substr(0, database_index);
        const table_name     = table.substr(database_index + 1, length)
        return this.mysql.query(
            "select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE "+ 
            "where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='"+table_name+"' "+
            "AND TABLE_SCHEMA='"+database+"'"
        ).then(([rows, fields]) => rows[0].COLUMN_NAME)
         .catch(err => err)
    }
}
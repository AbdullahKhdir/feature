'use strict';

const Lodash       = require('../../app/utils/Lodash');
const QueryBuilder = require('./QueryBuilder');

/**
 * @class BaseModel
 * @constructor
 * @extends QueryBuilder
 * @description Class BaseModel is used to prepare suitable environment to build queries for the models
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
        this.__       = new Lodash().__;
        this.mysql   = this.getDb();
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
        if (this.__.isString(id)) {
            id = +id;
        }

        if (this.__.isEmpty(table)) {
            return false;
        }

        if (this.__.isObject(id)) {
            return (async () => {
                return await this.executeModelQuery(`DELETE FROM ${table} WHERE ?;`, id);
            })()
        } else if (this.__.isNumber(id)) {
            return (async () => {
                return await this.executeModelQuery(`DELETE FROM ${table} WHERE ID = ?;`, id);
            })()
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
        if (this.__.isEmpty(table)) {
            return false;
        }

        return (async () => {
            return await this.executeModelQuery(
                `
                 DELETE 
                 FROM ${table} 
                 ORDER BY ID ASC
                `
            );
        })()
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
        if (this.__.isEmpty(table)) {
            return [];
        }
        
        if (this.__.isObject(sql_query) && this.__.isEmpty(table) === false) {
            let where_clause = '';
            for (const key in sql_query) {
                if (Object.hasOwnProperty.call(sql_query, key)) {
                    where_clause = where_clause + key + ' = ' + this.mysql.escape(sql_query[key]) + ' AND ';
                }
            }
            if (this.__.isString(where_clause) && !this.__.isEmpty(where_clause)) {
                const where_clause_length = where_clause.length;
                where_clause = where_clause.substring(0, where_clause_length - 4);
            }
            where_clause = this.mysql.escape(where_clause).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');

            return (async () => {
                return await this.executeModelQuery(`SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC`)
                .then(([rows, fields]) => {
                    if (!this.__.isEmpty(rows)) {
                        for (const key in this.columns) {
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                            [reverse_name]: await this.executeModelQuery(_statement) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
                                                });
                                            }
                                        } else {
                                            return (async () => {
                                                return {
                                                    [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            })()
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
                .catch(error => error)
            })()
        }

        if (this.__.isString(sql_query) && !this.__.isEmpty(table)) {
            sql_query = this.mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');

            return (async () => {
                return await this.executeModelQuery(
                    `
                    SELECT * 
                    FROM ${table} 
                    where ${sql_query}
                    ORDER BY ID ASC
                    `
                )
                .then(([rows, fields]) => {
                    if (!this.__.isEmpty(rows)) {
                        for (const key in this.columns) {
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                            [reverse_name]: await this.executeModelQuery(_statement) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
                                                });
                                            }
                                        } else {
                                            return (async () => {
                                                return {
                                                    [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            })()
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
                .catch(error => error)
            })()
        }

        if (!this.__.isNaN(sql_query) && this.__.isString(sql_query)) {
            sql_query = +sql_query;
        }
        
        if (!this.__.isNaN(sql_query) && this.__.isEmpty(table) === false) {
            return (async () => {
                return await this.executeModelQuery(
                    `
                     SELECT * 
                     FROM ${table} 
                     where id = ?
                     ORDER BY ID ASC
                    `
                    ,
                    [sql_query]
                )
                .then(([rows, fields]) => {
                    if (!this.__.isEmpty(rows)) {
                        for (const key in this.columns) {
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                            [reverse_name]: await this.executeModelQuery(_statement) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
                                                });
                                            }
                                        } else {
                                            return (async () => {
                                                return {
                                                    [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                .then(([results, fields]) => results)
                                                                .catch(err => err)
                                                }
                                            })()
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
                .catch(error => error)
            })()
        }

        if ((this.__.isEmpty(sql_query) && !this.__.isNaN(sql_query)) || sql_query == null) {
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
        if (this.__.isEmpty(table)) {
            return [];
        }

        if (this.__.isObject(sql_query) && this.__.isEmpty(table) === false) {
            let where_clause = '';
            for (const key in sql_query) {
                if (Object.hasOwnProperty.call(sql_query, key)) {
                    where_clause = where_clause + key + ' = ' + this.mysql.escape(sql_query[key]) + ' AND ';
                }
            }
            if (this.__.isString(where_clause) && !this.__.isEmpty(where_clause)) {
                const where_clause_length = where_clause.length;
                where_clause = where_clause.substring(0, where_clause_length - 4);
            }
            where_clause = this.mysql.escape(where_clause).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');

            return (async () => {
                return await this.executeModelQuery(`SELECT * FROM ${table} WHERE ${where_clause} ORDER BY ID ASC LIMIT 1`)
                .then(([rows, fields]) => {
                    if (!this.__.isEmpty(rows)) {
                        for (const key in this.columns) {
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                                    [reverse_name]: await this.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => err)
                                                                }
                                                            })()
                                                        });
                                                    }
                                                } else {
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
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
                .catch(error => error)   
            })()
        }

        if (this.__.isString(sql_query) && !this.__.isEmpty(table)) {
            sql_query = this.mysql.escape(sql_query).replaceAll("'", '').replaceAll('"', '').replaceAll("\\", '"');
            
            return (async () => {
                return await this.executeModelQuery(
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
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                                    [reverse_name]: await this.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => err)
                                                                }
                                                            })()
                                                        });
                                                    }
                                                } else {
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
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
                .catch(error => error)   
            })()
        }

        if (!this.__.isNaN(sql_query) && this.__.isString(sql_query)) {
            sql_query = +sql_query;
        }
        
        if (!this.__.isNaN(sql_query) && this.__.isEmpty(table) === false) {
            return (async () => {
                return await this.executeModelQuery(
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
                            rows['reverse_table_name'] = this.table; 
                            let column_name = key;
                            let is_constraint = this.columns[column_name].references;
                            if (typeof is_constraint !== 'undefined') {
                                let constraint_table = this.columns[column_name].references.table;
                                rows[column_name] = this.getTablePrimaryKey(constraint_table)
                                .then((id) => {
                                    return (async () => {
                                        return {
                                            [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                        }
                                    })()
                                });
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
                                                                    [reverse_name]: await this.executeModelQuery(_statement) 
                                                                                .then(([results, fields]) => results)
                                                                                .catch(err => err)
                                                                }
                                                            })()
                                                        });
                                                    }
                                                } else {
                                                    return (async () => {
                                                        return {
                                                            [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                                        .then(([results, fields]) => results)
                                                                        .catch(err => err)
                                                        }
                                                    })()
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
                .catch(error => error)   
            })()

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
        if (this.__.isEmpty(table) && !this.__.isString(table)) {
            return [];
        }

        return (async () => {
            return await this.executeModelQuery(
            `
             SELECT * 
             FROM ${table} 
             ORDER BY ID ASC
            `
            )
            .then(([rows, fields]) => {
                if (!this.__.isEmpty(rows)) {
                    for (const key in this.columns) {
                        rows['reverse_table_name'] = this.table; 
                        let column_name = key;
                        let is_constraint = this.columns[column_name].references;
                        if (typeof is_constraint !== 'undefined') {
                            let constraint_table = this.columns[column_name].references.table;
                            rows[column_name] = this.getTablePrimaryKey(constraint_table)
                            .then((id) => {
                                return (async () => {
                                    return {
                                        [is_constraint.name]: await this.executeModelQuery(`SELECT * FROM ${constraint_table} where ${id} = '${rows[0][column_name]}'`)
                                                                .then(([rows, fields]) => rows)
                                                                .catch(err => err)
                                    };
                                })()
                            });
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
                                                        [reverse_name]: await this.executeModelQuery(_statement) 
                                                                    .then(([results, fields]) => results)
                                                                    .catch(err => err)
                                                    }
                                                })()
                                            });
                                        }
                                    } else {
                                        return (async () => {
                                            return {
                                                [reverse_name]: await this.executeModelQuery(`SELECT * FROM ${reverse_table}`) 
                                                            .then(([results, fields]) => results)
                                                            .catch(err => err)
                                            }
                                        })()
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
        })();
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
        if (this.__.isEmpty(table) && !this.__.isString(table)) {
            return false;
        }
        
        if (!this.__.isObject(values) || this.__.isEmpty(values)) {
            return false;
        }
        
        return (async () => {
            return await this.executeModelQuery(`INSERT INTO ${table} SET ?;`, values);
        })();
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
        if (this.__.isEmpty(table) && !this.__.isString(table)) {
            return false;
        }
        
        if (!this.__.isObject(values) || this.__.isEmpty(values)) {
            return false;
        }
        
        if (where !== null && typeof where !== 'undefined') {
            if (this.__.isObject(where)) {
                return (async () => {
                    return await this.executeModelQuery(`UPDATE ${table} SET ? where ? ;`, [values, where]);
                })()
            } else if (!this.__.isNaN(where)) {
                where = +where;
                return (async () => {
                    return await this.executeModelQuery(`UPDATE ${table} SET ? where id = ? ;`, [values, where]);                    
                })()
            } else {
                where = this.escapeValue(where);
                return (async () => {
                    return await this.executeModelQuery(`UPDATE ${table} SET ? where id = ? ;`, [values, where]);
                })()
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
        return (async () => {
            return await  this.executeModelQuery(
                "select COLUMN_NAME from information_schema.KEY_COLUMN_USAGE "+ 
                "where CONSTRAINT_NAME='PRIMARY' AND TABLE_NAME='"+table_name+"' "+
                "AND TABLE_SCHEMA='"+database+"'"
            ).then(([rows, fields]) => rows[0].COLUMN_NAME)
            .catch(err => err)
        })();
    }
}
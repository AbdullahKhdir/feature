'use strict';

const Lodash = require("../../app/utils/Lodash");
const Db = require("../database/node/Db");
const FileSystem = require("../node/FileSystem");
const Path = require("../node/Path");

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
    constructor(model_name = null, query = null) {
        const mysql = super().mysql;
        this.#mysql  = mysql;
        this._ = new Lodash()._;
        
        this.#model = model_name;
        this.#query = query;
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
        return this.#model;
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
        if (!this._.isNull(modul_name)) {
            if (this._.isFunction(modul_name)) {
                this.path        = Object.assign(new Path().path);
                this.file_system = Object.assign(new FileSystem().fs);
                let modules_directory = this.path.join(__dirname, '..', '..', 'app', 'models');
                const level_one = this.file_system.readdirSync(modules_directory, { withFileTypes: true });
                if (this._.isEmpty(level_one) || !this._.isObject(level_one)) {
                    throw new Error ('Unable to scan models directory');
                } else {
                    level_one.forEach((file) => {
                        let is_dir  = file.isDirectory();
                        let is_file = file.isFile();
                        const model = modul_name.toString().match(/ (\w+)/)[1];
                            
                        if (is_file) {
                            const searched_model = this._.replace(file.name.toString(), '.js', '');
                            if (searched_model === model) {
                                let file_name    = model;
                                let required_model   = require(
                                    '../../app/models/'+directory_name+'/'+file_name+'.js'
                                );
                                this.#model = new required_model();
                                this.#query = `SELECT * FROM ${this.#model.table} `;
                            }
                        } else if (is_dir) {
                            let directory_name = file.name;
                            const level_two = this.file_system.readdirSync(modules_directory+'/'+file.name, { withFileTypes: true });
                            if (this._.isEmpty(level_two) || !this._.isObject(level_two)) {
                                throw new Error ('Unable to scan models directory');
                            }
                            level_two.forEach((file) => {
                                let is_file = file.isFile(); 
                                if (is_file) {
                                    const searched_model = this._.replace(file.name.toString(), '.js', '');
                                    if (searched_model === model) {
                                        let file_name    = model;
                                        let required_model   = require(
                                            '../../app/models/'+directory_name+'/'+file_name+'.js'
                                        );
                                        this.#model = new required_model();
                                        this.#query = `SELECT * FROM ${this.#model.table} `;
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (!this._.isEmpty(this.#query)) {
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
        if (!this._.isEmpty(this.#query)) {
            this.#query = this.#query + ' AND ';
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
    }
    
    /**
     * @method _or_
     * @description Adds an or operator
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
     */
    _or_() {
        if (!this._.isEmpty(this.#query)) {
            this.#query = this.#query + ' OR ';
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} = ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} != ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(Object.keys(this.#model.columns)))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value);
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value);
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value);
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value);
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = value.concat('%');
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(this.#model.columns)) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = value.concat('%');
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        const custom_query = this.escapeValue(sub_query).replaceAll("'", '').replaceAll('"', '');
        if (!this._.isEmpty(custom_query)) {
            this.#query = `${this.#query} ${custom_query} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
    }

    /**
     * @method reset
     * @description Emptys the sql query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns Boolean
     */
    reset() {
        this.#query = '';
        return !this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} IS NULL `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} IS NOT NULL `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(regex)) {
            if (this._.isEmpty(regex)) {
                return false;
            }
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} REGEXP ${regex} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(regex)) {
            if (this._.isEmpty(regex)) {
                return false;
            }
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            this.#query = `${this.#query} ${col.toString()} NOT REGEXP ${regex} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value.concat('%'));
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            value = '%'.concat(value.concat('%'));
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} NOT LIKE ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} >= ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} <= ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} < ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} > ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} <= ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        if (this._.isString(value)) {
            if (this._.isEmpty(value)) {
                return false;
            }
        } else if (!this._.isNumber(value)) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query) && object.includes(col.toString())) {
            const _value = this.escapeValue(value);
            this.#query = `${this.#query} ${col.toString()} >= ${_value} `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (!this._.isEmpty(this.#query)) {
            this.#query = `${this.#query} WHERE `;
        }
        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query)) {
            this.#query = `${this.#query} GROUP BY ${col.toString()} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
         if (!this._.isEmpty(this.#query) && !this._.isEmpty(condition)) {
            if (this.#query.search('GROUP BY') === -1 && this.#query.search('group by') === -1) {
                throw new Error('Using "Having" key word requires using "Group By" key word');
            }
            let _condition = this.escapeValue(condition).replaceAll("'", '').replaceAll('"', '');
            this.#query = `${this.#query} Having ${_condition} `;
            return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (this._.isEmpty(Object.keys(this.#model.columns))) {
            return false;
        }

        const object = Object.values(Object.keys(this.#model.columns));
        if (!object.includes(col.toString())) {
            throw new Error('Giving columns '+col.toString()+' does not exist in the table '+ this.#model.table);
        }

        if (!this._.isEmpty(this.#query)) {
            this.#query = `${this.#query} ORDER BY ${col.toString()} ${sort} `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
    }

    /**
     * @method nesting
     * @description Opens up a new bracket to nest conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
     */
    nesting() {
        if (!this._.isEmpty(this.#query)) {
            this.#query = `${this.#query} ( `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
    }

    /**
     * @method closeNesting
     * @description Closes an opend bracket of a nested conditions or sub query
     * @version 1.0.0
     * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
     * @returns QueryBuilder
     */
    closeNesting() {
        if (!this._.isEmpty(this.#query)) {
            this.#query = `${this.#query} ) `;
        }

        return !!this.#query ? new QueryBuilder(this.#model, this.#query) : !!this.#query;
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
        if (!this._.isNull(built_query)) {
            if (this._.isString(built_query)) {
                if (!this._.isEmpty(built_query)) {
                    return this.getDb().query(built_query);
                }
            }
        }
    }
}
import { trimQuery } from "#database/db.utils";

class QueryBuilder {

    dbActions = {
        CREATE: 'CREATE',
        DROP: 'DROP',
        SHOW: 'SHOW',
        SELECT: 'SELECT',
        INSERT: 'INSERT',
        UPDATE: 'UPDATE',
        DELETE: 'DELETE'
    };

    constructor(tableName) {
        this.reset();
        this._table = tableName;
    }

    /**
     * Reset the query builder to its initial state.
     * @returns {QueryBuilder}
     */
    reset() {
        this._type = this.dbActions.SELECT;
        this._fields = ['*'];
        this._constraints = [];
        this._where = [];
        this._values = [];
        this._limit = null;
        this._joins = [];
        this._orderBy = null;
        return this;
    }
    //#region Actions


    /**
     * Create a table with the specified columns.
     * .create() or .create(true) will generate CREATE TABLE table IF NOT EXISTS
     * @param {Array} columns 
     * @param {boolean} ifNotExists 
     * @returns {QueryBuilder}
     */
    create(columns = [], constraints = [], ifNotExists = true) {
        this._type = this.dbActions.CREATE;
        this._ifNotExists = ifNotExists;
        this._fields = columns;
        this._constraints = constraints;
        return this;
    }

    /**
     * Drop the table.
     * .drop() or .drop(true) will generate DROP TABLE table IF EXISTS
     * @param {boolean} ifExists 
     * @returns {QueryBuilder}
     */
    drop(ifExists = true) {
        this._ifExists = ifExists;
        this._type = this.dbActions.DROP;
        return this;
    }

    /**
     * Show the table.
     * .show() will generate SHOW TABLES LIKE 'table'
     * @returns {QueryBuilder}
     */
    show() {
        this._type = this.dbActions.SHOW;
        return this;
    }

    /**
     * Select fields from the table.
     * .select(['id', 'name']) will generate SELECT id, name FROM table
     * @param {Array|string} columns 
     * @returns {QueryBuilder}
     */
    select(columns = '*') {
        this._fields = Array.isArray(columns) ? columns : [columns];
        this._type = this.dbActions.SELECT;
        return this;
    }

    /**
     * Delete rows from the table.
     * .delete() will generate DELETE FROM table
     * @returns {QueryBuilder}
     */
    delete() {
        this._type = this.dbActions.DELETE;
        return this;
    }

    /**
     * Update rows in the table.
     * .update({ name: 'John', age: 30 }) will generate UPDATE table SET name = ?, age = ?
     * @param {Object} data 
     * @returns {QueryBuilder}
     */
    update(data) {
        this._values = Object.values(data);
        this._fields = Object.keys(data);
        this._type = this.dbActions.UPDATE;
        return this;
    }

    /**
     * Insert a new row into the table.
     * .insert({ name: 'John', age: 30 }) will generate INSERT INTO table (name, age) VALUES (?, ?)
     * @param {Object} data 
     * @returns {QueryBuilder}
     */
    insert(data) {
        this._type = this.dbActions.INSERT;
        this._values = Object.values(data);
        this._fields = Object.keys(data);
        return this;
    }
    //#endregion

    //#region WHERE clauses

    /**
     * Add a WHERE clause to the query.
     * .where(id, '=', 1) or .where('id', 1) will generate WHERE id = ?
     * @param {string} column 
     * @param {string} operator 
     * @param {*} value 
     * @returns {QueryBuilder}
     */
    where(column, operator, value) {
        if (value === undefined) {
            value = operator;
            operator = '=';
        }
        this._where.push(`${column} ${operator} ?`);
        this._values.push(value);
        return this;
    }

    /**
     * Add a WHERE IN clause to the query.
     * .whereIn('id', [1, 2, 3]) will generate WHERE id IN (?, ?, ?)
     * @param {string} column 
     * @param {Array} values 
     * @returns {QueryBuilder}
     */
    whereIn(column, values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('Values for whereIn must be a non-empty array');
        }
        const placeholders = values.map(() => '?').join(', ');
        this._where.push(`${column} IN (${placeholders})`);
        this._values.push(...values);
        return this;
    }

    /**
     * Add a WHERE NOT IN clause to the query.
     * .whereNotIn('id', [1, 2, 3]) will generate WHERE id NOT IN (?, ?, ?)
     * @param {string} column
     * @param {Array} values
     * @returns {QueryBuilder}
     */
    whereNotIn(column, values) {
        if (!Array.isArray(values) || values.length === 0) {
            throw new Error('Values for whereNotIn must be a non-empty array');
        }
        const placeholders = values.map(() => '?').join(', ');
        this._where.push(`${column} NOT IN (${placeholders})`);
        this._values.push(...values);
        return this;
    }

    /**
     * Add a WHERE IS NULL clause to the query.
     * .whereNull('column') will generate WHERE column IS NULL
     * @param {string} column
     * @returns {QueryBuilder}
     */
    whereNull(column) {
        this._where.push(`${column} IS NULL`);
        return this;
    }

    /**
     * Add a WHERE IS NOT NULL clause to the query.
     * .whereNotNull('column') will generate WHERE column IS NOT NULL
     * @param {string} column
     * @returns {QueryBuilder}
     */
    whereNotNull(column) {
        this._where.push(`${column} IS NOT NULL`);
        return this;
    }
    
    /**
     * Add a WHERE BETWEEN clause to the query.
     * .whereBetween('column', start, end) will generate WHERE column BETWEEN ? AND ?
     * @param {string} column
     * @param {*} start
     * @param {*} end
     * @returns {QueryBuilder}
     */
    whereBetween(column, start, end) {
        this._where.push(`${column} BETWEEN ? AND ?`);
        this._values.push(start, end);
        return this;
    }

    /**
     * Add a WHERE NOT BETWEEN clause to the query.
     * .whereNotBetween('column', start, end) will generate WHERE column NOT BETWEEN ? AND ?
     * @param {string} column
     * @param {*} start
     * @param {*} end
     * @returns {QueryBuilder}
     */
    whereNotBetween(column, start, end) {
        this._where.push(`${column} NOT BETWEEN ? AND ?`);
        this._values.push(start, end);
        return this;
    }

    /**
     * Add a WHERE LIKE clause to the query.
     * .whereLike('column', pattern) will generate WHERE column LIKE ?
     * @param {string} column
     * @param {string} pattern
     * @returns {QueryBuilder}
     */
    whereLike(column, pattern) {
        this._where.push(`${column} LIKE ?`);
        this._values.push(pattern);
        return this;
    }

    /**
     * Add a WHERE NOT LIKE clause to the query.
     * .whereNotLike('column', pattern) will generate WHERE column NOT LIKE ?
     * @param {string} column
     * @param {string} pattern
     * @returns {QueryBuilder}
     */
    whereNotLike(column, pattern) {
        this._where.push(`${column} NOT LIKE ?`);
        this._values.push(pattern);
        return this;
    }

    /**
     * Add a WHERE EXISTS clause to the query.
     * .whereExists('SELECT 1 FROM other_table WHERE other_table.column = this_table.column') will generate WHERE EXISTS (subquery)
     * @param {string} subquery
     * @returns {QueryBuilder}
     */
    whereExists(subquery) {
        this._where.push(`EXISTS (${subquery})`);
        return this;
    }

    /**
     * Add a WHERE NOT EXISTS clause to the query.
     * .whereNotExists('SELECT 1 FROM other_table WHERE other_table.column = this_table.column') will generate WHERE NOT EXISTS (subquery)
     * @param {string} subquery
     * @returns {QueryBuilder}
     */
    whereNotExists(subquery) {
        this._where.push(`NOT EXISTS (${subquery})`);
        return this;
    }

    /**
     * Add a raw WHERE clause to the query.
     * .whereRaw('raw SQL condition', [values]) will generate WHERE raw SQL condition
     * @param {string} rawCondition
     * @param {Array} values
     * @returns {QueryBuilder}
     */
    whereRaw(rawCondition, values = []) {
        this._where.push(rawCondition);
        this._values.push(...values);
        return this;
    }

    //#region Connectors

    /**
     * Add an AND clause to the query.
     * .and() will generate AND in the WHERE clause
     * @returns {QueryBuilder}
     */
    and() {
        this._where.push('AND');
        return this;
    }
    /**
     * Add an OR clause to the query.
     * .or() will generate OR in the WHERE clause
     * @returns {QueryBuilder}
     */
    or() {
        this._where.push('OR');
        return this;
    }

    //#endregion

    //#endregion

    //#region Joins, Ordering, and Limits

    /**
     * Add a JOIN clause to the query.
     * .join('other_table', 'this_table.column', '=', 'other_table.column') or .join('other_table', 'this_table.column', 'other_table.column') will generate INNER JOIN other_table ON this_table.column = other_table.column
     * @param {string} otherTable - The name of the table to join.
     * @param {string} tableColumn - The column from the current table to join on.
     * @param {string} operator - The operator for the join condition (default is '=').
     * @param {string} otherTableColumn - The column from the other table to join on.
     * @param {string} type - The type of join (default is 'INNER').
     * @returns {QueryBuilder}
     */
    join(otherTable, tableColumn, operator, otherTableColumn, type = 'INNER') {

        if (otherTableColumn === undefined) {
            otherTableColumn = operator;
            operator = '=';
        }
        if (!this._joins) {
            this._joins = [];
        }
        this._joins.push(`${type} JOIN ${otherTable} ON ${tableColumn} ${operator} ${otherTableColumn}`);
        return this;
    }

    /**
     * Add an ORDER BY clause to the query.
     * .orderBy('column', 'ASC') will generate ORDER BY column ASC
     * @param {string} column - The column to order by.
     * @param {string} direction - The direction of the order (default is 'ASC').
     * @returns {QueryBuilder}
     */
    orderBy(column, direction = 'ASC') {
        this._orderBy = `${column} ${direction}`;
        return this;
    }

    /**
     * Add a LIMIT clause to the query.
     * .limit(10) will generate LIMIT 10
     * @param {number} count - The maximum number of records to return.
     * @returns {QueryBuilder}
     */
    limit(count) {
        this._limit = count;
        return this;
    }

    //#endregion
    //#region Generate SQL

    /**
     * Generate the SQL query string and values array.
     * @returns {{ query: string, values: any[] }} An object containing the SQL query string and the values array.
     */
    toSQL() {
        let sql = '';
        switch (this._type) {
            case this.dbActions.CREATE:
                sql = `CREATE TABLE ${this._ifNotExists ? 'IF NOT EXISTS ' : ''}${this._table}`;
                const columnsDefinition = this._fields.join(', ');
                const constraintsDefinition = this._constraints.join(', ');
                const definitions = [columnsDefinition, constraintsDefinition].filter(def => def).join(', ');
                if (definitions) {
                    sql += ` (${definitions})`;
                }
                break;
            case this.dbActions.DROP:
                sql = `DROP TABLE ${this._ifExists ? 'IF EXISTS ' : ''}${this._table}`;
                break;
            case this.dbActions.SHOW:
                sql = `SHOW TABLES LIKE '${this._table}'`;
                break;
            case this.dbActions.SELECT:
                sql = `SELECT ${this._fields.join(', ')} FROM ${this._table}`;
                break;
            case this.dbActions.INSERT:
                sql = `INSERT INTO ${this._table} (${this._fields.join(', ')}) VALUES (${this._fields.map(() => '?').join(', ')})`;
                break;
            case this.dbActions.UPDATE:
                sql = `UPDATE ${this._table} SET ${this._fields.map(field => `${field} = ?`).join(', ')}`;
                break;
            case this.dbActions.DELETE:
                sql = `DELETE FROM ${this._table}`;
                break;
            default:
                throw new Error(`Unsupported query type: ${this._type}`);
        }
        if (this._where.length) {
            sql += ` WHERE ${this._where.join(' ')}`;
        }

        if (this._joins.length) {
            sql += ` ${this._joins.join(' ')}`;
        }

        if (this._orderBy) {
            sql += ` ORDER BY ${this._orderBy}`;
        }
        if (this._limit !== null) {
            sql += ` LIMIT ${this._limit}`;
        }
        const finalQuery = trimQuery(sql);
        const finalValues = this._values;
        this.reset();
        return { query: finalQuery, values: finalValues };
    }
    //#endregion

}

export default QueryBuilder;
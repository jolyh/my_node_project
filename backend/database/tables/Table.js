import { assertValidIdentifier } from "#database/db.utils";
import Logger from '#utils/Logger';
import QueryBuilder from "#database/QueryBuilder";

/**
 * Base class for database tables.
 * Provides common functionality for checking existence, creating, dropping, and resetting tables.
 * This class should be extended by specific table classes to define their columns and constraints.
 * @class Table
 * @method checkSelfExists
 * @method createSelf
 * @method dropSelf
 * @method resetSelf
 */
class Table {
    constructor(tableName, tableColumns, tableConstraints) {
        assertValidIdentifier(tableName, 'table name');
        this.tableName = tableName;
        this.queryBuilder = new QueryBuilder(tableName);
        this.tableColumns = tableColumns;
        this.tableConstraints = tableConstraints;
    }

    /**
     * Sets up the table by checking if it exists and creating it if it doesn't.
     * @param {Object} dbInstance - The database instance to use.
     */
    setup = async (dbInstance) => {
        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            await this.createSelf(dbInstance);
        }
    };

    checkSelfExists = async (dbInstance) => {
        const { query, values } = this.queryBuilder
            .show()
            .toSQL();
        const [result] = await dbInstance.query(query, values);
        return result.length > 0;
    };

    createSelf = async (dbInstance) => {

        const exists = await this.checkSelfExists(dbInstance);
        if (exists) {
            console.log(`Table already exists: ${this.tableName} - skipping creation.`);
            Logger.systemInfo(`Table already exists: ${this.tableName} - skipping creation.`);
            return;
        }

        Logger.systemInfo(`Creating table: ${this.tableName}`);
        const { query, values } = this.queryBuilder
            .create(this.tableColumns.toArray(), this.tableConstraints.toArray())
            .toSQL();
        const result = await dbInstance.execute(query, values);
        Logger.systemInfo(`Table creation result: ${JSON.stringify(result)}`);
    };

    dropSelf = async (dbInstance) => {

        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            Logger.systemInfo(`Table does not exist: ${this.tableName} - skipping drop.`);
            return;
        }

        const { query, values } = this.queryBuilder
            .drop()
            .toSQL();
        Logger.systemInfo(`Dropping table: ${this.tableName}`);
        const result = await dbInstance.execute(query, values);
        Logger.systemInfo(`Table drop result: ${JSON.stringify(result)}`);
    };

    resetSelf = async (dbInstance) => {
        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            Logger.systemInfo(`Table does not exist: ${this.tableName} - skipping reset.`);
            return;
        }

        Logger.systemInfo(`Resetting table: ${this.tableName}`);
        await this.dropSelf(dbInstance);
        await this.setup(dbInstance);
    };

}

export default Table;
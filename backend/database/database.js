import mysql from 'mysql2/promise';
import config from '#configs/config';
import { assertValidIdentifier } from '#database/db.utils';
import { AppError, errorTypes } from '#errors/AppError';
import Logger from '#utils/Logger';

// Tables
import Table from "#database/tables/Table";
import UsersTable from "#database/tables/UsersTable";
import OrdersTable from '#database/tables/OrdersTable';
import AuditLogsTable from '#database/tables/AuditLogsTable';
import TasksTable from '#database/tables/TasksTable';

const connectToDatabase = async () => {
    const dbConfig = {
        host: process.env.DB_ADDR,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        throw new AppError(
            errorTypes.DB.CONNECTION_FAILED,
            error
        );
    }
};

//#region DB

/**
 * Checks if the specified database exists.
 * @param {string} dbName - The name of the database to check.
 * @param {Object} [connection] - The optional database connection to use.
 * @returns {Promise<boolean>} - Returns true if the database exists, false otherwise.
 * @throws {AppError} If there is an error while checking the database existence.
 */
const checkIfDatabaseExists = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');
    let ownsConnection = false;
    try {
        if (!connection) {
            connection = await connectToDatabase();
            ownsConnection = true;
        }
        const [rows] = await connection.query(`SHOW DATABASES LIKE ?`, [dbName]);
        return rows.length > 0;
    } catch (error) {
        throw new AppError(
            errorTypes.DB.CONNECTION_FAILED,
            error
        );
    } finally {
        if (ownsConnection) await connection?.end();
    }
};

/**
 * Creates the specified database if it does not already exist.
 * If the database is already present, no action will be taken.
 * If the database is missing it will be created. This will not create any tables within it.
 * @param {string} dbName - The name of the database to create.
 * @param {Object} [connection] - The optional database connection to use.
 * @throws {AppError} If there is an error while creating the database.
 */
const createDatabaseIfNotExists = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');

    const databaseExists = await checkIfDatabaseExists(dbName, connection);
    if (databaseExists) {
        return;
    }

    let ownsConnection = false;
    try {
        if (!connection) {
            connection = await connectToDatabase();
            ownsConnection = true;
        }
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        Logger.systemInfo(`Database '${dbName}' is ready.`);
    } catch (error) {
        throw new AppError(
            errorTypes.DB.INITIALIZATION_FAILED,
            error
        );
    } finally {
        if (ownsConnection) await connection?.end();
    }
};

const teardownDatabaseIfExists = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');
    
    const databaseExists = await checkIfDatabaseExists(dbName, connection);
    if (!databaseExists) {
        Logger.systemInfo(`Database '${dbName}' does not exist. Skipping`);
        return;
    }

    let ownsConnection = false;

    try {
        if (!connection) {
            connection = await connectToDatabase();
            ownsConnection = true;
        }
        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);
        Logger.systemInfo(`Database '${dbName}' has been torn down.`);
    } catch (error) {
        throw new AppError(
            errorTypes.DB.TEARDOWN_FAILED,
            error
        );
    } finally {
        if (ownsConnection) await connection?.end();
    }
};

/**
 * Nukes and recreates the specified database. 
 * This operation will remove all tables and data in the specified database.
 * This operation will not recreate the tables; they will need to be set up separately.
 * @param {string} dbName - The name of the database to reset.
 * @param {Object} [connection] - The optional database connection to use.
 * @throws {AppError} If there is an error while resetting the database.
 */
const nukeAndRecreateDatabase = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');

    try {
        await teardownDatabaseIfExists(dbName, connection);
        await createDatabaseIfNotExists(dbName, connection);
    } catch (error) {

        if (error instanceof AppError) throw error;

        throw new AppError(
            errorTypes.DB.RESET_FAILED,
            error
        );
    }
};
//#endregion

//#region Tables

/**
 * Sets up all necessary tables in the database.
 * @param {Object} dbInstance - The database instance to use for setting up tables.
 */
const setupTables = async (dbInstance) => {

    Logger.systemInfo("Setting up database tables...");

    // Users - required for all other tables
    const usersTable = new UsersTable(config.db.USERS_TABLE_NAME);
    await usersTable.setup(dbInstance);

    // Orders
    const ordersTable = new OrdersTable(
        config.db.ORDERS_TABLE_NAME,
        config.db.USERS_TABLE_NAME
    );
    await ordersTable.setup(dbInstance);

    const tasksTable = new TasksTable(config.db.TASKS_TABLE_NAME);
    await tasksTable.setup(dbInstance);

    // Audit logs
    if (process.env.ENABLE_AUDIT_LOGS === 'true') {
        const auditLogsTable = new AuditLogsTable(config.db.AUDIT_LOGS_TABLE_NAME);
        await auditLogsTable.setup(dbInstance);
    }

    Logger.systemInfo("Database tables setup completed.");

};

const getExistingTables = async (dbInstance) => {
    const [rows] = await dbInstance.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`
    );
    return rows.map(row => row.table_name);
};

/**
 * Drops all active tables in the database.
 * @param {Object} dbInstance - The database instance to use for dropping tables.
 */
const dropExistingTables = async (dbInstance) => {
    const existingTables = await getExistingTables(dbInstance);
    for (const tableName of existingTables) {
        const table = new Table(tableName); // Assuming a generic Table class can be used
        await table.dropSelf(dbInstance);
    }
};

//#endregion

const database = {
    createIfNotExists: createDatabaseIfNotExists,
    teardownIfExists: teardownDatabaseIfExists,
    nukeAndRecreate: nukeAndRecreateDatabase,
    setupTables: setupTables,
    dropExistingTables,
    getExistingTables
};

export default database;
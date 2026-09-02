import mysql from 'mysql2/promise';
import config from '../configs/config.js';
import { assertValidIdentifier } from './identifier.js';
import { UsersTable } from "./tables/UsersTable.js";
import { OrdersTable } from './tables/OrdersTable.js';
import { AuditLogsTable } from './tables/AuditLogsTable.js';
import { AppError, errorTypes } from '../errors/AppError.js';
import Logger from '../utils/Logger.js';

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
            errorTypes.DATABASE_CONNECTION_FAILED,
            'Failed to connect to the database',
            { cause: error }
        );
    }
};

const createDatabaseIfNotExists = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');
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
            errorTypes.DATABASE_INITIALIZATION_FAILED,
            `Error creating database '${dbName}'`,
            { cause: error }
        );
    } finally {
        if (ownsConnection) await connection?.end();
    }
};

const nukeAndRecreateDatabase = async (dbName, connection = null) => {
    assertValidIdentifier(dbName, 'database name');
    let ownsConnection = false;
    try {
        Logger.systemInfo(`Resetting database: ${dbName}.`);
        if (!connection) {
            connection = await connectToDatabase();
            ownsConnection = true;
        }

        await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);

        Logger.systemInfo(`Recreating database: ${dbName}.`);
        await connection.query(`CREATE DATABASE \`${dbName}\``);

        Logger.systemInfo('Database successfully reset.');
    } catch (error) {
        throw new AppError(
            errorTypes.DATABASE_INITIALIZATION_FAILED,
            `Error resetting database '${dbName}'`,
            { cause: error }
        );
    } finally {
        if (ownsConnection) await connection?.end();
    }
};

const setupTables = async (dbInstance) => {

    // To allow inserting a user with ID 0 (for system user), 
    // we need to disable the auto-increment check temporarily
    const usersTable = new UsersTable(config.db.USERS_TABLE_NAME);
    await usersTable.setup(dbInstance);

    const ordersTable = new OrdersTable(
        config.db.ORDERS_TABLE_NAME, 
        config.db.USERS_TABLE_NAME
    );
    await ordersTable.setup(dbInstance);

    if (process.env.ENABLE_AUDIT_LOGS === 'true') {
        Logger.systemInfo('Audit logs are enabled. Setting up audit logs table.');
        const auditLogsTable = new AuditLogsTable(config.db.AUDIT_LOGS_TABLE_NAME);
        await auditLogsTable.setup(dbInstance);
    }

};

const database = {
    createIfNotExists: createDatabaseIfNotExists,
    nukeAndRecreate: nukeAndRecreateDatabase,
    setup: setupTables,
};

export default database;
import { createDbInstance } from "#database/db.instance";

import UsersTable from "#database/tables/UsersTable";
import OrdersTable from "#database/tables/OrdersTable";
import AuditLogsTable from "#database/tables/AuditLogsTable";
import TasksTable from "#database/tables/TasksTable";

import config from "#configs/config";

const hasDatabaseConfig = [
    "DB_ADDR",
    "DB_USER",
    "DB_NAME",
    "DB_PASSWORD",
    "TEST_DB_NAME",
].every((name) => process.env[name]);

const tables = {
    users: config.db.USERS_TABLE_NAME ? new UsersTable(config.db.USERS_TABLE_NAME) : null,
    orders: config.db.ORDERS_TABLE_NAME ? new OrdersTable(config.db.ORDERS_TABLE_NAME) : null,
    auditLogs: config.db.AUDIT_LOGS_TABLE_NAME ? new AuditLogsTable(config.db.AUDIT_LOGS_TABLE_NAME) : null,
    tasks: config.db.TASKS_TABLE_NAME ? new TasksTable(config.db.TASKS_TABLE_NAME) : null
};

const setupDb = async () => {
    
    process.env.NODE_ENV = "test";
    process.env.NUKE_DATABASE_ON_INIT = "true";

    if (!hasDatabaseConfig) { throw new Error("Database configuration is missing"); }
    const dbInstance = createDbInstance({
        databaseName: process.env.TEST_DB_NAME,
        nukeOnInit: true
    });
    await dbInstance.init();

    return dbInstance;
};

const resetDb = async (dbInstance) => {
    if (!hasDatabaseConfig) { return; }
    await dbInstance.reset();
    return dbInstance;
};

const teardownDb = async (dbInstance) => {
    if (!hasDatabaseConfig) { return; }
    await dbInstance.teardown();
    return dbInstance;
};

export { setupDb, resetDb, teardownDb, hasDatabaseConfig, tables };
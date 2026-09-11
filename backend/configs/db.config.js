const dbConfig = {
    
    // Database configuration
    DB_CONNECTION_LIMIT: 10,
    DB_QUEUE_LIMIT: 0,
    DB_ENABLE_KEEP_ALIVE: true,
    DB_KEEP_ALIVE_INITIAL_DELAY: 10000, // 10 seconds
    DB_CONNECT_TIMEOUT: 10000, // 10 seconds
    FLAGS: '+FOUND_ROWS',

    // Table names
    AUDIT_LOGS_TABLE_NAME: process.env.DB_AUDIT_LOGS_TABLE || 'audit_logs',
    // Main entity tables
    USERS_TABLE_NAME: process.env.DB_USERS_TABLE || 'users',
    ORDERS_TABLE_NAME: process.env.DB_ORDERS_TABLE || 'orders',
    TASKS_TABLE_NAME: process.env.DB_TASKS_TABLE || 'tasks'
};

export default Object.freeze(dbConfig);
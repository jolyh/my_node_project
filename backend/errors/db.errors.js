const dbErrors = {
    INITIALIZATION_FAILED: {
        code: 'DATABASE_INITIALIZATION_FAILED',
        status: 700,
        message: 'Failed to initialize the database'
    },
    RESET_FAILED: {
        code: 'DATABASE_RESET_FAILED',
        status: 701,
        message: 'Failed to reset the database'
    },
    RESET_NOT_ALLOWED: {
        code: 'DATABASE_RESET_NOT_ALLOWED',
        status: 702,
        message: 'Database reset is only allowed in test environment'
    },
    CONNECTION_FAILED: {
        code: 'DATABASE_CONNECTION_FAILED',
        status: 703,
        message: 'Failed to connect to the database'
    },
    TABLE_CREATION_FAILED: {
        code: 'DATABASE_TABLE_CREATION_FAILED',
        status: 704,
        message: 'Failed to create required database table'
    },
    TABLE_DROP_FAILED: {
        code: 'DATABASE_TABLE_DROP_FAILED',
        status: 705,
        message: 'Failed to drop database table'
    },
    REQUIRED_TABLE_MISSING: {
        code: 'DATABASE_REQUIRED_TABLE_MISSING',
        status: 706,
        message: 'Required database table is missing'
    },
    SYSTEM_USER_CREATION_FAILED: {
        code: 'DATABASE_SYSTEM_USER_CREATION_FAILED',
        status: 707,
        message: 'Failed to create system user in the database'
    },
    SYSTEM_USER_MISSING: {
        code: 'DATABASE_SYSTEM_USER_MISSING',
        status: 708,
        message: 'System user is missing in the database'
    },
    QUERY_FAILED: {
        code: 'DATABASE_QUERY_FAILED',
        status: 709,
        message: 'Database query execution failed'
    },
    TEARDOWN_FAILED: {
        code: 'DATABASE_TEARDOWN_FAILED',
        status: 710,
        message: 'Failed to tear down the database'
    },
};

export default Object.freeze(dbErrors);
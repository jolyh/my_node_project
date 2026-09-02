const criticalErrors = {
    //#region Service
    SERVICE_MISSING_REQUIRED_DB: {
        code: 'SERVICE_MISSING_REQUIRED_DB',
        status: 600,
        message: 'A required database instance is missing'
    },
    SERVICE_MISSING_REQUIRED_REPOSITORY: {
        code: 'SERVICE_MISSING_REQUIRED_REPOSITORY',
        status: 601,
        message: 'A required repository instance is missing'
    },
    SERVICES_FAILED_TO_INITIALIZE: {
        code: 'SERVICES_FAILED_TO_INITIALIZE',
        status: 602,
        message: 'Failed to initialize services'
    },
    //#endregion
    //#region Repository
    REPOSITORY_MISSING_REQUIRED_DB: {
        code: 'REPOSITORY_MISSING_REQUIRED_DB',
        status: 610,
        message: 'A required database instance is missing for the repository'
    },
    REPOSITORIES_FAILED_TO_INITIALIZE: {
        code: 'REPOSITORIES_FAILED_TO_INITIALIZE',
        status: 611,
        message: 'Failed to initialize repositories'
    },
    //#endregion
    //#region Router
    ROUTER_MISSING_REQUIRED_SERVICE: {
        code: 'ROUTER_MISSING_REQUIRED_SERVICE',
        status: 620,
        message: 'A required service instance is missing for the router'
    },
    ROUTER_MISSING_REQUIRED_REPOSITORY: {
        code: 'ROUTER_MISSING_REQUIRED_REPOSITORY',
        status: 621,
        message: 'A required repository instance is missing for the router'
    },
    ROUTER_FAILED_TO_INITIALIZE: {
        code: 'ROUTER_FAILED_TO_INITIALIZE',
        status: 622,
        message: 'Failed to initialize router'
    },
    //#endregion
    //#region Controller
    CONTROLLER_MISSING_REQUIRED_SERVICE: {
        code: 'CONTROLLER_MISSING_REQUIRED_SERVICE',
        status: 630,
        message: 'A required service instance is missing for the controller'
    },
    CONTROLLERS_FAILED_TO_INITIALIZE: {
        code: 'CONTROLLERS_FAILED_TO_INITIALIZE',
        status: 631,
        message: 'Failed to initialize controllers'
    },
    //#endregion
    //#region Database
    DATABASE_INITIALIZATION_FAILED: {
        code: 'DATABASE_INITIALIZATION_FAILED',
        status: 700,
        message: 'Failed to initialize the database'
    },
    DATABASE_RESET_NOT_ALLOWED: {
        code: 'DATABASE_RESET_NOT_ALLOWED',
        status: 701,
        message: 'Database reset is only allowed in test environment'
    },
    DATABASE_CONNECTION_FAILED: {
        code: 'DATABASE_CONNECTION_FAILED',
        status: 702,
        message: 'Failed to connect to the database'
    },
    DATABASE_TABLE_CREATION_FAILED: {
        code: 'DATABASE_TABLE_CREATION_FAILED',
        status: 703,
        message: 'Failed to create required database table'
    },
    DATABASE_REQUIRED_TABLE_MISSING: {
        code: 'DATABASE_REQUIRED_TABLE_MISSING',
        status: 704,
        message: 'Required database table is missing'
    },
    DATABASE_SYSTEM_USER_CREATION_FAILED: {
        code: 'DATABASE_SYSTEM_USER_CREATION_FAILED',
        status: 705,
        message: 'Failed to create system user in the database'
    },
    DATABASE_SYSTEM_USER_MISSING: {
        code: 'DATABASE_SYSTEM_USER_MISSING',
        status: 706,
        message: 'System user is missing in the database'
    },
    DATABASE_QUERY_FAILED: {
        code: 'DATABASE_QUERY_FAILED',
        status: 500,
        message: 'Database query execution failed'
    },
    //#endregion
};

export default Object.freeze(criticalErrors);
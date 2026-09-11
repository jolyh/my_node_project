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
};

export default Object.freeze(criticalErrors);
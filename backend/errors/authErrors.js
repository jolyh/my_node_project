const authErrors = {
    AUTH_FAILED: {
        code: 'AUTH_FAILED',
        status: 401,
        message: 'Authentication failed'
    },
    MISSING_TOKEN: {
        code: 'MISSING_TOKEN',
        status: 401,
        message: 'Authentication token is missing'
    },
    INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        status: 401,
        message: 'Invalid authentication token'
    },
    EXPIRED_TOKEN: {
        code: 'EXPIRED_TOKEN',
        status: 401,
        message: 'Authentication token has expired'
    },
    UNAUTHORIZED_ACCESS: {
        code: 'UNAUTHORIZED_ACCESS',
        status: 403,
        message: 'You do not have permission to access this resource'
    }
};

export default Object.freeze(authErrors);
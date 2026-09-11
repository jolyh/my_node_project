import apiErrors from '#errors/api.errors';
import authErrors from '#errors/auth.errors';
import criticalErrors from '#errors/critical.errors';
import dbErrors from '#errors/db.errors';

class AppError extends Error {
    constructor(errorType, cause = null) {
        super(errorType.message);
        this.code = errorType.code;
        this.statusCode = errorType.status;
        this.isOperational = true;

        if (cause) { this.cause = cause;}
        
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorTypes = Object.freeze({
    API: apiErrors,
    AUTH: authErrors,
    CRITICAL: criticalErrors,
    DB: dbErrors
});

export { AppError, errorTypes };
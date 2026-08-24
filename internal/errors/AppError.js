import apiErrors from './apiErrors.js';
import authErrors from './authErrors.js';
import criticalErrors from './criticalErrors.js';

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
});

export { AppError, errorTypes };
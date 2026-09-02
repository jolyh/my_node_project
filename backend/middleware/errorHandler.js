import Logger from '../utils/Logger.js';

const createErrorHandler = (onCriticalError = () => {}) => (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.isOperational ? err.message : 'An unexpected error occurred';
    const isCritical = statusCode > 599;
    const responseStatus = err.isOperational && statusCode >= 400 && statusCode < 600 ? statusCode : 500;

 
    if (isCritical) onCriticalError(err);

    Logger.error(
        req.currentUser?.id,
        req.headers['x-request-id'] || '',
        `Error occurred: ${message}`,
        { stack: err.stack, code, statusCode }
    );

    res.status(responseStatus).json({
        error: { code, message }
    });

};

export default createErrorHandler;
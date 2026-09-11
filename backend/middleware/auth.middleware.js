import { jwtUtils } from "#utils/jwt.utils";
import jwtConfig from '#configs/jwt.config';

import { AppError, errorTypes } from '#errors/AppError';

const requireAuthentication = (req, res, next) => {
    let token = null;

    // 1. Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Fallback to cookies if header is missing
    else if (req.cookies && req.cookies[jwtConfig.JWT_COOKIE_NAME]) {
        token = req.cookies[jwtConfig.JWT_COOKIE_NAME];
    }
    
    // Reject if no token found
    if (!token) {
        throw new AppError(
            errorTypes.AUTH.MISSING_TOKEN,
            'Access denied. No token provided.'
        );
    }

    try {
        // Verify token using your secret key
        const decoded = jwtUtils.verify(token);
        req.currentUser = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
        }; // Attach user payload to request object
        next();
    } catch (error) {
        throw new AppError(
            errorTypes.AUTH.INVALID_TOKEN,
            'Invalid or expired token.'
        );
    }
};

/**
 * Check if the current user has one of the allowed roles.
 * @param  {...any} allowedRoles 
 * @returns 
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.currentUser || !allowedRoles.includes(req.currentUser.role)) {
            throw new AppError(
                errorTypes.AUTH.FORBIDDEN,
                'Access denied. Insufficient permissions.'
            );
        }
        next();
    };
};

export { requireAuthentication, requireRole };

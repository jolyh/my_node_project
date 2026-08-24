// middleware/auth.middleware.js
import { jwtService } from "./jwtService.js";
import config from "../configs/config.js";
import Logger from '../utils/Logger.js';

import { AppError, errorTypes } from '../errors/AppError.js';

const authMiddleware = (req, res, next) => {
    let token = null;

    // 1. Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Fallback to cookies if header is missing
    else if (req.cookies && req.cookies[config.JWT_COOKIE_NAME]) {
        token = req.cookies[config.JWT_COOKIE_NAME];
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
        const decoded = jwtService.verify(token);
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

export default authMiddleware;

import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/Logger.js';

const requestMiddleware = (req, res, next) => {
    req.headers['x-request-id'] = uuidv4(); // Assign a unique request ID for tracking
    req.headers['x-request-timestamp'] = Date.now(); // Assign a timestamp for the request
    next();
};

export default requestMiddleware;

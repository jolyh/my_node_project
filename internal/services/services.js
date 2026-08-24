import UserService from './UserService.js';
import OrderService from './OrderService.js';
import AuthService from './AuthService.js';
import AuditLogService from './AuditLogService.js';
import Logger from '../utils/Logger.js';

const services = async (db, repositories) => {

    const services = {};

    try {
    
        // Order
        const orderService = new OrderService(repositories.orderRepository);
        services.orderService = orderService;

        // User
        const userService = new UserService(repositories.userRepository);
        services.userService = userService;

        // Auth
        const authService = new AuthService(repositories.userRepository);
        services.authService = authService;

        // Audit Log
        const auditLogService = new AuditLogService(repositories.auditLogRepository);
        services.auditLogService = auditLogService;

        return services;

    } catch (error) {
        Logger.systemError('Service initialization failed', error);
        process.exit(1);
    }
};

export default services;
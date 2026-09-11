import AuthService from '#services/AuthService';
import UsersService from '#services/UsersService';
import OrdersService from '#services/OrdersService';
import AuditLogsService from '#services/AuditLogsService';
import TasksService from '#services/TasksService';
import { AppError, errorTypes } from '#errors/AppError';

const services = async (db, repositories) => {

    const services = {};

    try {

        
        // Auth
        const authService = new AuthService(repositories.usersRepository);
        services.authService = authService;
    
        // Order
        const orderService = new OrdersService(repositories.ordersRepository);
        services.orderService = orderService;

        // User
        const userService = new UsersService(repositories.usersRepository);
        services.userService = userService;

        // Audit Log
        const auditLogService = new AuditLogsService(repositories.auditLogsRepository);
        services.auditLogService = auditLogService;

        // Task
        const taskService = new TasksService(repositories.tasksRepository);
        services.taskService = taskService;

        return services;

    } catch (error) {
        throw new AppError(
            errorTypes.CRITICAL.SERVICES_FAILED_TO_INITIALIZE,
            'Failed to initialize services: ' + (error.message ? ': ' + error.message : '')
        );
    }
};

export default services;
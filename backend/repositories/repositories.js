
import UsersRepository from '#repositories/UsersRepository';
import OrdersRepository from '#repositories/OrdersRepository';
import AuditLogsRepository from '#repositories/AuditLogsRepository';
import TasksRepository from '#repositories/TasksRepository';
import { AppError, errorTypes } from '#errors/AppError';

const initRepositories = async (dbInstance) => {

    const repositories = {};

    try {
        const ordersRepository = new OrdersRepository(dbInstance);
        repositories.ordersRepository = ordersRepository;

        const usersRepository = new UsersRepository(dbInstance);
        repositories.usersRepository = usersRepository;

        const auditLogsRepository = new AuditLogsRepository(dbInstance);
        repositories.auditLogsRepository = auditLogsRepository;

        const tasksRepository = new TasksRepository(dbInstance);
        repositories.tasksRepository = tasksRepository;

        return repositories;
    } catch (error) {
        throw new AppError(
            errorTypes.CRITICAL.REPOSITORIES_FAILED_TO_INITIALIZE,
            'Failed to initialize repositories' + (error.message ? ': ' + error.message : '')
        );
    }
};

export default initRepositories;

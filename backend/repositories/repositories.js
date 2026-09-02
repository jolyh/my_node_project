
import UserRepository from './UserRepository.js';
import OrderRepository from './OrderRepository.js';
import AuditLogRepository from './AuditLogRepository.js';
import { AppError, errorTypes } from '../errors/AppError.js';

const initRepositories = async (dbInstance) => {

    const repositories = {};

    try {
        const orderRepository = new OrderRepository(dbInstance);
        repositories.orderRepository = orderRepository;

        const userRepository = new UserRepository(dbInstance);
        repositories.userRepository = userRepository;

        const auditLogRepository = new AuditLogRepository(dbInstance);
        repositories.auditLogRepository = auditLogRepository;

        return repositories;
    } catch (error) {
        throw new AppError(
            errorTypes.CRITICAL.REPOSITORIES_FAILED_TO_INITIALIZE,
            'Failed to initialize repositories' + (error.message ? ': ' + error.message : '')
        );
    }
};

export default initRepositories;

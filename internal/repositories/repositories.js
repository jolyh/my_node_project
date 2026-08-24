
import UserRepository from './UserRepository.js';
import OrderRepository from './OrderRepository.js';
import AuditLogRepository from './AuditLogRepository.js';
import Logger from '../utils/Logger.js';

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
        Logger.systemError('Repository initialization failed', error);
        process.exit(1);
    }
};

export default initRepositories;

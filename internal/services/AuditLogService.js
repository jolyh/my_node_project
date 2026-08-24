import auditLogTypes from '../models/logger/types.js';

class AuditLogService {

    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    async list(options = {}) {
        return this.auditLogRepository.list(options);
    }

    async create(data, options = {}) {
        if (process.env.ENABLE_AUDIT_LOGS !== 'true') {
            return null;
        }
        return this.auditLogRepository.create(data, options);
    }
}

export default AuditLogService;
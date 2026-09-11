class AuditLogsService {

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

export default AuditLogsService;
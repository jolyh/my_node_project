import { AppError, errorTypes } from '#errors/AppError';
import QueryBuilder from '#database/QueryBuilder';
import AuditLogs from '#models/logger/auditLogs';

class AuditLogsRepository {
    tableName = process.env.DB_AUDIT_LOGS_TABLE || 'audit_logs';

    constructor(db) {
        if (!db) throw new AppError(
            errorTypes.INTERNAL_ERRORS.REPOSITORY_MISSING_REQUIRED_DB,
            'AuditLogsRepository requires a valid database instance'
        );
        this.db = db;
        this.queryBuilder = new QueryBuilder(this.tableName); // Initialize queryBuilder
    }

    async list(options = {}) {
        const client = options.connection || this.db;
        const { query } = this.queryBuilder
            .select()
            .toSQL();
        const [rows] = await client.execute(query);
        return rows;
    }

    async create(data, options = {}) {
        const toInsert = AuditLogs.forCreation(data);
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .insert(toInsert)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.insertId;
    }
}

export default AuditLogsRepository;
import Table from "#database/tables/Table";
import Logger from '#utils/Logger';

const auditLogsColumns = {
    id: {
        query: "id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1))",
    },
    author_id: {
        query: "author_id INT UNSIGNED NULL",
    },
    type: {
        query: "type INT UNSIGNED DEFAULT 0",
    },
    request_id: {
        query: "request_id VARCHAR(36) NULL",
    },
    message: {
        query: "log TEXT NOT NULL",
    },
    details: {
        query: "details TEXT NULL",
    },
    timestamp: {
        query: "timestamp TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3)",
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

const auditLogsConstraints = {
    fk_audit_logs_author: {
        query: `CONSTRAINT fk_audit_logs_author
                FOREIGN KEY (author_id) 
                REFERENCES users(id)
                ON DELETE SET NULL 
                ON UPDATE CASCADE`,
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

class AuditLogsTable extends Table {

    static auditLogsColumns = auditLogsColumns;
    static auditLogsConstraints = auditLogsConstraints;

    constructor(tableName = "audit_logs") {
        super(tableName, auditLogsColumns, auditLogsConstraints);
    }

    setup = async (dbInstance) => {
        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            await this.createSelf(dbInstance);
        } else {
            Logger.systemInfo(`Audit logs table already exists: ${this.tableName}`);
        }
    };

}

export default AuditLogsTable;
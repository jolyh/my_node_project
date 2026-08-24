import { assertValidIdentifier } from "../identifier.js";
import Logger from '../../utils/Logger.js';
import QueryBuilder from "../QueryBuilder.js";

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
    fk_author: {
        query: `CONSTRAINT fk_author
                FOREIGN KEY (author_id) 
                REFERENCES users(id)
                ON DELETE SET NULL`,
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

class AuditLogsTable {

    static auditLogsColumns = auditLogsColumns;
    static auditLogsConstraints = auditLogsConstraints;

    constructor(tableName = "audit_logs") {
        assertValidIdentifier(tableName, 'table name');
        this.tableName = tableName;
        this.queryBuilder = new QueryBuilder(tableName);
    }

    setup = async (dbInstance) => {
        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            await this.createSelf(dbInstance);
        } else {
            Logger.systemInfo(`Audit logs table already exists: ${this.tableName}`);
        }
    };

    checkSelfExists = async (dbInstance) => {
        const { query: checkQuery, values: checkValues } = this.queryBuilder.show().toSQL();
        const [result] = await dbInstance.execute(checkQuery, checkValues);
        return result.length > 0;
    };

    createSelf = async (dbInstance) => {
        const { query, values } = this.queryBuilder
            .create(auditLogsColumns.toArray(), auditLogsConstraints.toArray()).toSQL();
        await dbInstance.execute(query, values);
        Logger.systemInfo(`Audit logs table created successfully: ${this.tableName}`);
    }

    dropSelf = async (dbInstance) => {
        const { query, values } = this.queryBuilder.drop().toSQL();
        await dbInstance.execute(query, values);
        Logger.systemInfo(`Audit logs table dropped successfully: ${this.tableName}`);
    }

}

export { auditLogsColumns, AuditLogsTable };
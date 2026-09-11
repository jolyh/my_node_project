import assert from "node:assert/strict";
import { describe, it } from "node:test";

import AuditLogs from "#models/logger/auditLogs";
import { auditLogToCreate, systemAuditLogToCreate } from "./logger.js";

describe("AuditLogs model", () => {
    it("maps an audit entry to its database creation shape", () => {
        assert.deepEqual(AuditLogs.forCreation(auditLogToCreate), auditLogToCreate);
    });

    it("preserves system author zero and null request IDs", () => {
        const entry = AuditLogs.forCreation(systemAuditLogToCreate);

        assert.equal(entry.author_id, 0);
        assert.equal(entry.request_id, null);
    });

    it("maps database columns to the API model", () => {
        assert.deepEqual(AuditLogs.new({
            id: 1,
            author_id: auditLogToCreate.author_id,
            request_id: auditLogToCreate.request_id,
            type: auditLogToCreate.type,
            log: auditLogToCreate.log,
            details: auditLogToCreate.details,
            timestamp: "2030-01-15T12:00:00.000Z"
        }), {
            id: 1,
            authorId: auditLogToCreate.author_id,
            requestId: auditLogToCreate.request_id,
            type: auditLogToCreate.type,
            log: auditLogToCreate.log,
            details: auditLogToCreate.details,
            timestamp: "2030-01-15T12:00:00.000Z"
        });
    });
});
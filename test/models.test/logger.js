const auditLogToCreate = {
    author_id: 1,
    request_id: "00000000-0000-0000-0000-000000000001",
    type: 0,
    log: "User action recorded.",
    details: { resource: "user", action: "read" }
};

const systemAuditLogToCreate = {
    author_id: 0,
    request_id: null,
    type: 0,
    log: "System event recorded.",
    details: null
};

export { auditLogToCreate, systemAuditLogToCreate };

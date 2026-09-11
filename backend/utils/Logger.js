import auditLogTypes from '#models/logger/types';
import AuditLogs from '#models/logger/auditLogs';

let auditLogService = null;
const pendingEntries = [];

const write = (
    level,
    authorId,
    requestId,
    message, 
    details,
) => {
    const entry = AuditLogs.forCreation({
        author_id: authorId,
        request_id: requestId,
        type: level,
        log: message,
        details: details,
    });

    if (process.env.DEBUG === 'true') {
        console.log("DEBUG", entry);
    }

    if (!auditLogService) {
        pendingEntries.push(entry);
        return;
    }

    void auditLogService.create(entry).catch(() => {});
};

const createLogger = (auditLogServiceInstance = null) => {
    auditLogService = auditLogServiceInstance;
    flushPendingEntries();
    return loggerInstance;
};

const flushPendingEntries = () => {
    if (!auditLogService) return;
    for (const entry of pendingEntries.splice(0)) {
        void auditLogService.create(entry).catch(() => {});
    }
};

const loggerInstance = {

    init(auditLogServiceInstance) {
        auditLogService = auditLogServiceInstance;
        flushPendingEntries();
    },

    info(authorId, requestId, message, details) {
        write(
            auditLogTypes.INFO,
            authorId,
            requestId,
            message, 
            details,
        );
    },
    error(authorId, requestId, message, details) {
        write(
            auditLogTypes.ERROR,
            authorId,
            requestId,
            message, 
            details,
        );
    },
    systemInfo(message, details) {
        this.info(Number(process.env.SYSTEM_USER_ID ?? 0), null, message, details);
    },
    systemError(message, details) {
        this.error(Number(process.env.SYSTEM_USER_ID ?? 0), null, message, details);
    },
};

const Logger = createLogger();

export { createLogger };
export default Object.freeze(Logger);
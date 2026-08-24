const auditLogTypes = {
    INFO: 0,
    WARNING: 1,
    ERROR: 2,
    CRITICAL: 3,
    toString: (type) => {
        switch (type) {
            case auditLogTypes.INFO:
                return 'INFO';
            case auditLogTypes.WARNING:
                return 'WARNING';
            case auditLogTypes.ERROR:
                return 'ERROR';
            case auditLogTypes.CRITICAL:
                return 'CRITICAL';
            default:
                return 'UNKNOWN';
        }
    }
};

export default Object.freeze(auditLogTypes);
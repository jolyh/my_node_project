const AuditLogs = {
    new: (data) => {
        return {
            id: data.id ?? null,
            authorId: data.author_id ?? null,
            requestId: data.request_id ?? null,
            type: data.type ?? 0,
            log: data.log ?? '',
            details: data.details ?? null,
            timestamp: data.timestamp ?? null,
        };
    },
    forCreation: (data) => {
        return { 
            author_id: data.author_id ?? null,
            request_id: data.request_id ?? null,
            type: data.type ?? 0,
            log: data.log ?? '',
            details: data.details ?? '',
        };
    },
    toArray: (data) => {
        return Object.values(data)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
}

export default AuditLogs;
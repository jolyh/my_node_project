import { status } from "./task.status.js";

const Task = {
    new: (data) => {
        return {
            id: data.id || null,
            authorId: data.author_id || null,
            title: data.title || null,
            description: data.description || null,
            status: data.status || status.PENDING,
            createdAt: data.created_at || new Date(),
            updatedAt: data.updated_at || new Date(),
        };
    },
    forCreation: (data) => {
        return {
            author_id: data.authorId,
            title: data.title,
            description: data.description,
            status: data.status ?? status.PENDING
        };
    },
    forUpdate: (data) => {
        return {
            author_id: data.authorId || data.author_id,
            title: data.title,
            description: data.description,
            status: data.status ?? status.PENDING,
        };
    },
    sanitize: (data) => {
        // Remove sensitive fields like password before sending to client
        return data;
    }
};

export default Task;
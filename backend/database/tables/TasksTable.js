import Logger from '#utils/Logger';
import Table from "#database/tables/Table";

const statusEnum = {
    NEW: 0,
    PENDING: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    ARCHIVED: 4,
};

const tasksColumns = {
    id: {
        query: "id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1))",
    },
    author_id: {
        query: "author_id INT UNSIGNED",
    },
    title: {
        query: "title VARCHAR(255) NOT NULL",
    },
    description: {
        query: "description TEXT NULL",
    },
    status: {
        query: `status TINYINT UNSIGNED NOT NULL DEFAULT ${statusEnum.NEW}`,
    },
    due_time: {
        query: "due_time TIMESTAMP(3) NULL",
    },
    created_at: {
        query: "created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3)",
    },
    updated_at: {
        query: "updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)",
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

const tasksConstraints = {
    fk_tasks_author: {
        query: `INDEX idx_tasks_author_id (author_id),
            CONSTRAINT fk_tasks_author
            FOREIGN KEY (author_id)
            REFERENCES users(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE`,
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

class TasksTable extends Table {

    static tasksColumns = tasksColumns;
    static tasksConstraints = tasksConstraints;

    constructor(tableName = "tasks") {
        super(tableName, tasksColumns, tasksConstraints);
    }

    setup = async (dbInstance) => {
        const exists = await this.checkSelfExists(dbInstance);
        if (!exists) {
            await this.createSelf(dbInstance);
        } else {
            Logger.systemInfo(`Table already exists: ${this.tableName}`);
        }
    };

}

export default TasksTable;
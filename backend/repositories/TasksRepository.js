import Task from '#models/task';
import { AppError, errorTypes } from '#errors/AppError';
import QueryBuilder from '#database/QueryBuilder';

/**
 * TasksRepository class that handles database operations related to tasks.
 */
class TasksRepository {

    tableName = process.env.DB_TASKS_TABLE || "tasks";

    /**
     * @param {Object} db - The database instance for executing queries.
     */
    constructor(db) {
        if (!db) throw new AppError(
            errorTypes.CRITICAL.REPOSITORY_MISSING_REQUIRED_DB,
            "TasksRepository requires a valid database instance"
        );
        this.db = db;
        this.queryBuilder = new QueryBuilder(this.tableName); // Initialize queryBuilder
    }

    //#region GET
    async list(options = {}) {
        const client = options.connection || this.db;
        const { query } = this.queryBuilder
            .select()
            .toSQL();
        const [rows] = await client.execute(query, []);
        const tasks = rows.map(row => Task.new(row));
        return tasks;
    }

    async getById(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('id', '=', id)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows[0] ? Task.new(rows[0]) : null;
    }

    async getByAuthorId(authorId, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('author_id', '=', authorId)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows.map(row => Task.new(row));
    }
    //endregion

    //#region CREATE/UPDATE
    async create(task, options = {}) {
        const client = options.connection || this.db;
        console.log("Creating task:", task);
        const { query, values } = this.queryBuilder
            .insert(task)
            .toSQL();
            console.log("Query:", query, "Values:", values);
        const [result] = await client.execute(query, values);
        return result.insertId;
    }

    async update(id, task, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .update(task)
            .where('id', '=', id)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.affectedRows;
    }
    //#endregion

    //#region DELETE
    async delete(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .delete()
            .where('id', '=', id)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.affectedRows;
    }
    //endregion

}

export default TasksRepository;
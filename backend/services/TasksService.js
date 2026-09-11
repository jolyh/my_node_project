import { runInTransaction } from "#database/db.transaction.runner";
import { isNullOrUndefined } from '#utils/comparison.utils';
import { AppError, errorTypes } from '#errors/AppError';

class TasksService {

    /**
     * @param {TasksRepository} taskRepository - An instance of TasksRepository for database operations.
     */
    constructor(taskRepository) {
        if (!taskRepository) throw new AppError(
            errorTypes.CRITICAL.SERVICE_MISSING_REQUIRED_REPOSITORY,
            "TaskService requires a taskRepository"
        );
        this.taskRepository = taskRepository;
    }

    //#region GET
    async listTasks(currentUser) {
        const tasks = await this.taskRepository.list();
        return tasks;
    }

    async findTask(currentUser, id) {
        const task = await this.taskRepository.getById(id);
        if (!task) {
            throw new AppError(
                errorTypes.API.RESOURCE_NOT_FOUND,
                `Task with ID: ${id} not found`
            );
        }
        return task;
    }

    async findTasksByAuthorId(currentUser, authorId) {
        const tasks = await this.taskRepository.getByAuthorId(authorId);
        return tasks;
    }
    //endregion

    //#region CREATE/UPDATE
    async createTask(currentUser, taskData) {
        return await runInTransaction(this.taskRepository.db, async (connection) => {
            const newTaskId = await this.taskRepository.create(taskData, { connection });
            console.log("New Task ID:", newTaskId);
            if (isNullOrUndefined(newTaskId)) {
                throw new AppError(
                    errorTypes.API.RESOURCE_CREATION_FAILED,
                    `Failed to create task`
                );
            }
            return newTaskId;
        });
    }

    async updateTask(currentUser, id, taskData) {
        return await runInTransaction(this.taskRepository.db, async (connection) => {
            const updated = await this.taskRepository.update(id, taskData, { connection });
            if (isNullOrUndefined(updated)) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `Task with ID: ${id} not found`
                );
            }
            return updated;
        });
    }
    //#endregion

    //#region DELETE
    async deleteTask(currentUser, id) {
        return await runInTransaction(this.taskRepository.db, async (connection) => {
            const deleted = await this.taskRepository.delete(id, { connection });
            if (isNullOrUndefined(deleted)) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `Task with ID: ${id} not found`
                );
            }
            return deleted;
        });
    }
    //#endregion

}

export default TasksService;

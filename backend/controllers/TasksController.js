import { AppError, errorTypes } from "#errors/AppError";
import Task from "#models/task";
import Logger from '#utils/Logger';

class TasksController {

    constructor(taskService) {
        if (!taskService) throw new AppError(
            errorTypes.CRITICAL.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "TasksController requires a taskService"
        );
        this.taskService = taskService;
    }

    //#region Task
    async findTask(req, res) {
        const taskId = req.params.id;
        const task = await this.taskService.findTask(req.currentUser, taskId);
        res.status(200).json({ task });
    }

    async createTask(req, res) {
        const body = req.body;
        const toCreate = Task.forCreation(body);
        const createdId = await this.taskService.createTask(req.currentUser, toCreate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Task ${createdId} created.`);
        res.status(201).json({ taskId: createdId });
    }

    async updateTask(req, res) {
        const taskId = req.params.id;
        const body = req.body;
        const toUpdate = Task.forUpdate(body);
        const updated = await this.taskService.updateTask(req.currentUser, taskId, toUpdate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Task ${taskId} updated.`);
        res.status(200).json({ task: updated });
    }

    async deleteTask(req, res) {
        const taskId = req.params.id;
        await this.taskService.deleteTask(req.currentUser, taskId);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Task ${taskId} deleted.`);
        res.status(200).json({ message: `Task with ID: ${taskId} deleted successfully` });
    }
    //#endregion

    //#region Tasks
    async list(req, res) {
        const tasks = await this.taskService.listTasks(req.currentUser);
        res.status(200).json({ tasks });
    }

    async findByAuthorId(req, res) {
        const authorId = req.params.authorId;
        const tasks = await this.taskService.findTasksByAuthorId(req.currentUser, authorId);
        res.status(200).json({ tasks });
    }
    //#endregion
}

export default TasksController;

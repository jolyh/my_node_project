import { AppError, errorTypes } from '#errors/AppError';
import User from '#models/users/user';
import Logger from '#utils/Logger';

class UsersController {

    constructor(
        userService, 
        orderService = null,
        taskService = null
    ) {
        if (!userService) throw new AppError(
            errorTypes.CRITICAL.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "UsersController requires a userService"
        );
        this.userService = userService;
        this.orderService = orderService;
        this.taskService = taskService;
    }

    //#region User
    async findUser(req, res) {
        const userId = parseInt(req.params.id, 10);
        const user = await this.userService.findUser(req.currentUser, userId);
        res.status(200).json({ user });
    }

    async getCurrentUser(req, res) {
        const user = await this.userService.findUserByEmail(req.currentUser.email);
        res.status(200).json({ user });
    }

    async createUser(req, res) {
        const body = req.body;
        const toCreate = User.forCreation(body)
        const createdId = await this.userService.createUser(req.currentUser, toCreate);
        Logger.info(req.currentUser?.id ?? createdId, req.headers['x-request-id'], `User ${createdId} created.`);
        res.status(201).json({ userId: createdId });
    }

    async updateUser(req, res) {
        const userId = parseInt(req.params.id, 10);
        const body = req.body;
        const toUpdate = User.forUpdate(body);
        const updated = await this.userService.updateUser(req.currentUser, userId, toUpdate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `User ${userId} updated.`);
        res.status(200).json({ user: updated });
    }

    async deleteUser(req, res) {
        const userId = parseInt(req.params.id, 10);
        const deleted = await this.userService.deleteUser(req.currentUser, userId);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `User ${userId} deleted.`);
        res.status(200).json({ message: `User with ID: ${userId} deleted successfully` });
    }
    //#endregion

    //#region Users
    async list(req, res) {
        const users = await this.userService.listUsers(req.currentUser);
        res.status(200).json({ users: users });
    }

    //#endregion

    //#region Orders
    async listOrders(req, res) {
        const userId = parseInt(req.params.id, 10);
        const orders = await this.orderService.findOrdersByUserId(req.currentUser, userId);
        res.status(200).json({ orders });
    }
    //#endregion

    //#region Tasks
    async listTasks(req, res) {
        const userId = parseInt(req.params.id, 10);
        const tasks = await this.taskService.findTasksByAuthorId(req.currentUser, userId);
        res.status(200).json({ tasks });
    }
    //#endregion

}

export default UsersController;
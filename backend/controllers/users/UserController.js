import User from "../../models/users/user.js";
import { AppError, errorTypes } from "../../errors/AppError.js";
import Logger from '../../utils/Logger.js';

class UserController {

    constructor(
        userService, 
        orderService = null
    ) {
        if (!userService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "UserController requires a userService"
        );
        this.userService = userService;
        this.orderService = orderService;
    }

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

    async listOrders(req, res) {
        const userId = parseInt(req.params.id, 10);
        const orders = await this.orderService.findOrdersByUserId(req.currentUser, userId);
        res.status(200).json({ orders });
    }
}

export default UserController;
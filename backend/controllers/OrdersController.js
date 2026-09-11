import { AppError, errorTypes } from "#errors/AppError";
import Order from "#models/orders/order";
import Logger from '#utils/Logger';

class OrdersController {

    constructor(orderService) {
        if (!orderService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "OrdersController requires an orderService"
        );
        this.orderService = orderService;
    }

    //#region Order
    async findOrder(req, res) {
        const orderId = req.params.id;
        const order = await this.orderService.findOrder(req.currentUser, orderId);
        res.status(200).json({ order });
    }

    async createOrder(req, res) {
        const body = req.body;
        const toCreate = Order.forCreation(body);
        const createdId = await this.orderService.createOrder(req.currentUser, toCreate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${createdId} created.`);
        res.status(201).json({ orderId: createdId });
    }

    async updateOrder(req, res) {
        const orderId = req.params.id;
        const body = req.body;
        const toUpdate = Order.forUpdate(body);
        const updated = await this.orderService.updateOrder(req.currentUser, orderId, toUpdate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${orderId} updated.`);
        res.status(200).json({ order: updated });
    }

    async deleteOrder(req, res) {
        const orderId = req.params.id;
        await this.orderService.deleteOrder(req.currentUser, orderId);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${orderId} deleted.`);
        res.status(200).json({ message: `Order with ID: ${orderId} deleted successfully` });
    }
    //#endregion

    //#region Orders
    async list(req, res) {
        const orders = await this.orderService.listOrders(req.currentUser);
        res.status(200).json({ orders });
    }

    async findByUserId(req, res) {
        const userId = req.params.userId;
        const orders = await this.orderService.findOrdersByUserId(req.currentUser, userId);
        res.status(200).json({ orders });
    }
    //#endregion
}

export default OrdersController;
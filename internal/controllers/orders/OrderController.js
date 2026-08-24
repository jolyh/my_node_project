import { AppError, errorTypes } from "../../errors/AppError.js";
import Order from "../../models/orders/order.js";
import Logger from '../../utils/Logger.js';

class OrderController {

    constructor(orderService) {
        if (!orderService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "OrderController requires an orderService"
        );
        this.orderService = orderService;
    }

    async findOrder(req, res) {
        const orderId = req.params.id;
        const order = await this.orderService.findOrder(orderId);
        res.status(200).json({ order });
    }

    async createOrder(req, res) {
        const body = req.body;
        const toCreate = Order.forCreation(body);
        const createdId = await this.orderService.createOrder(toCreate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${createdId} created.`);
        res.status(201).json({ orderId: createdId });
    }

    async updateOrder(req, res) {
        const orderId = req.params.id;
        const body = req.body;
        const toUpdate = Order.forUpdate(body);
        const updated = await this.orderService.updateOrder(orderId, toUpdate);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${orderId} updated.`);
        res.status(200).json({ order: updated });
    }

    async deleteOrder(req, res) {
        const orderId = req.params.id;
        await this.orderService.deleteOrder(orderId);
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], `Order ${orderId} deleted.`);
        res.status(200).json({ message: `Order with ID: ${orderId} deleted successfully` });
    }
}

export default OrderController;
import { AppError, errorTypes } from "../../errors/AppError.js";
class OrdersController {

    constructor(orderService) {
        if (!orderService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "OrdersController requires an orderService"
        );
        this.orderService = orderService;
    }

    async list(req, res) {
        const orders = await this.orderService.listOrders();
        res.json({ orders });
    }

    async findByUserId(req, res) {
        const userId = req.params.userId;
        const orders = await this.orderService.findOrdersByUserId(userId);
        res.json({ orders });
    }
}

export default OrdersController;
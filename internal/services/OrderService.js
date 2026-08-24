import Order from '../models/orders/order.js';
import { runInTransaction } from "../utils/dbTransactionRunner.js";
import { AppError, errorTypes } from '../errors/AppError.js';

class OrderService {

    /**
     * @param {OrderRepository} orderRepository - An instance of OrderRepository for database operations.
     */
    constructor(orderRepository) {
        if (!orderRepository) throw new AppError(
            errorTypes.SERVICE_ERRORS.MISSING_REQUIRED_REPOSITORY,
            "OrderService requires an orderRepository"
        );
        this.orderRepository = orderRepository;
    }

    //#region GET
    async listOrders(currentUser) {
        const orders = await this.orderRepository.list();
        return orders;
    }

    async findOrder(currentUser, id) {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new AppError(
                errorTypes.API.RESOURCE_NOT_FOUND,
                `Order with ID: ${id} not found`
            );
        }
        return order;
    }

    async findOrdersByUserId(currentUser, userId) {
        const orders = await this.orderRepository.getByUserId(userId);
        return orders;
    }
    //endregion

    //#region CREATE/UPDATE
    async createOrder(currentUser, orderData) {
        return await runInTransaction(this.orderRepository.db, async (connection) => {
            const newOrderId = await this.orderRepository.create(orderData, { connection });
            if (!newOrderId) {
                throw new AppError(
                    errorTypes.API.RESOURCE_CREATION_FAILED,
                    `Failed to create order`
                );
            }
            return newOrderId;
        });
    }

    async updateOrder(currentUser, id, orderData) {
        return await runInTransaction(this.orderRepository.db, async (connection) => {
            const updated = await this.orderRepository.update(id, orderData, { connection });
            if (!updated) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `Order with ID: ${id} not found`
                );
            }
            return updated;
        });
    }
    //#endregion

    // #region DELETE
    async deleteOrder(currentUser, id) {
        return await runInTransaction(this.orderRepository.db, async (connection) => {
            const deleted = await this.orderRepository.delete(id, { connection });
            if (!deleted) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `Order with ID: ${id} not found`
                );
            }
            return deleted;
        });
    }
    //#endregion

}

export default OrderService;
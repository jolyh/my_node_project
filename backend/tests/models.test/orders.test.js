import assert from "node:assert/strict";
import { describe, it } from "node:test";

import Order from "../../models/orders/order.js";
import orderStatus from "../../models/orders/status.js";
import { orderToCreate, orderToUpdate } from "./orders.js";

describe("Order model", () => {
    it("maps API fields to database fields for creation", () => {
        assert.deepEqual(Order.forCreation(orderToCreate), {
            user_id: orderToCreate.userId,
            product_id: orderToCreate.productId,
            quantity: orderToCreate.quantity,
            total_price: orderToCreate.totalPrice,
            status: orderToCreate.status,
            delivery_date: orderToCreate.deliveryDate
        });
    });

    it("preserves pending status zero during creation", () => {
        const order = Order.forCreation({ ...orderToCreate, status: orderStatus.PENDING });

        assert.equal(order.status, orderStatus.PENDING);
    });

    it("maps update fields consistently", () => {
        assert.deepEqual(Order.forUpdate(orderToUpdate), {
            user_id: orderToUpdate.userId,
            product_id: orderToUpdate.productId,
            quantity: orderToUpdate.quantity,
            total_price: orderToUpdate.totalPrice,
            status: orderToUpdate.status,
            delivery_date: orderToUpdate.deliveryDate
        });
    });
});
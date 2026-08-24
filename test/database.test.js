import assert from "node:assert/strict";
import { test } from "node:test";

import config from "../internal/configs/config.js";
import { createDbInstance } from "../internal/database/dbInstance.js";
import { UsersTable } from "../internal/database/tables/UsersTable.js";
import { OrdersTable } from "../internal/database/tables/OrdersTable.js";
import { AuditLogsTable } from "../internal/database/tables/AuditLogsTable.js";
import UserRepository from "../internal/repositories/UserRepository.js";
import OrderRepository from "../internal/repositories/OrderRepository.js";
import orderStatus from "../internal/models/orders/status.js";
import { orderToCreate, orderToUpdate } from "./models.test/orders.js";
import { userToCreate } from "./models.test/users.js";

process.env.NODE_ENV = "test";

const hasDatabaseConfig = [
    "DB_ADDR",
    "DB_USER",
    "TEST_DB_NAME"
].every((name) => process.env[name]);

test("user repository persists data in the test users table", {
    skip: !hasDatabaseConfig
        ? "DB_ADDR, DB_USER, and TEST_DB_NAME are required for database tests"
        : false
}, async () => {
    const dbInstance = createDbInstance({
        databaseName: process.env.TEST_DB_NAME,
        nukeOnInit: true
    });
    const user = new UsersTable(config.db.USERS_TABLE_NAME);
    const order = new OrdersTable(config.db.ORDERS_TABLE_NAME, config.db.USERS_TABLE_NAME);
    const auditLog = new AuditLogsTable(config.db.AUDIT_LOGS_TABLE_NAME);
    let databaseInitialized = false;

    try {
        await dbInstance.init();
        databaseInitialized = true;

        const userRepository = new UserRepository(dbInstance);

        // The system user should already exist in the users table after initialization
        // We should have exactly one user in the table at the start
        assert.deepEqual((await userRepository.list()).length, 1);

        const userId = await userRepository.create({
            ...userToCreate,
            email: `test-${Date.now()}@example.com`
        });
        assert.equal(typeof userId, "number");

        const insertedUser = await userRepository.findById(userId);
        assert.equal(insertedUser.id, userId);
        assert.equal(insertedUser.name, userToCreate.name);
        assert.equal(insertedUser.password, userToCreate.password);

        const orderRepository = new OrderRepository(dbInstance);
        const orderData = { ...orderToCreate, userId, status: orderStatus.IN_PROGRESS };
        const orderId = await orderRepository.create(orderData);
        assert.equal(typeof orderId, "number");

        const insertedOrder = await orderRepository.getById(orderId);
        assert.equal(insertedOrder.id, orderId);
        assert.equal(insertedOrder.userId, userId);
        assert.equal(insertedOrder.productId, orderData.productId);
        assert.equal(insertedOrder.quantity, orderData.quantity);
        assert.equal(Number(insertedOrder.totalPrice), orderData.totalPrice);
        assert.equal(insertedOrder.status, orderData.status);
        assert.ok(insertedOrder.deliveryDate);

        assert.equal((await orderRepository.list()).length, 1);
        assert.equal((await orderRepository.getByUserId(userId)).length, 1);

        const updatedOrder = { ...orderToUpdate, userId, status: orderStatus.COMPLETED };
        assert.equal(await orderRepository.update(orderId, updatedOrder), 1);

        const selectedUpdatedOrder = await orderRepository.getById(orderId);
        assert.equal(selectedUpdatedOrder.productId, updatedOrder.productId);
        assert.equal(selectedUpdatedOrder.quantity, updatedOrder.quantity);
        assert.equal(Number(selectedUpdatedOrder.totalPrice), updatedOrder.totalPrice);
        assert.equal(selectedUpdatedOrder.status, updatedOrder.status);

        assert.equal(await orderRepository.delete(orderId), 1);
        assert.equal(await orderRepository.getById(orderId), null);
        assert.deepEqual(await orderRepository.list(), []);

        const updatedUser = {
            ...insertedUser,
            name: "Updated Test User",
            email: `updated-${Date.now()}@example.com`,
            password: "updated-password" // Password cannot be updated via this call and should remain
        };
        assert.equal(await userRepository.update(userId, updatedUser), 1);

        const selectedUpdatedUser = await userRepository.findById(userId);
        assert.equal(selectedUpdatedUser.name, "Updated Test User");
        assert.equal(selectedUpdatedUser.email, updatedUser.email);
        assert.equal(selectedUpdatedUser.password, userToCreate.password);

        assert.equal(await userRepository.delete(userId), 1);
        assert.equal(await userRepository.findById(userId), null);
        
        // The system user should still exist in the users table after all operations
        assert.deepEqual((await userRepository.list()).length, 1);
    } finally {
        if (databaseInitialized) {
            await auditLog.dropSelf(dbInstance);
            await order.dropSelf(dbInstance);
            await user.dropSelf(dbInstance);
            await dbInstance.close();
        }

    }
});
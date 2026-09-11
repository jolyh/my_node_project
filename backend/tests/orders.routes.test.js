import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import orderRoutes from "#routers/api/orders.routes";
import { emptyOrdersController } from "./test.utils.js";
import { orderRequest } from "./models.test/orders.js";

const createApp = (router, path) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

describe("order routes", () => {
    const createOrderRouter = () => {
        const calls = [];
        const ordersController = {
            ...emptyOrdersController(),
            async findOrder(req, res) {
                calls.push(["find", req.params.id]);
                res.json({ order: { id: Number(req.params.id) } });
            },
            async createOrder(req, res) {
                calls.push(["create", req.body]);
                res.status(201).json({ orderId: 10 });
            },
            async updateOrder(req, res) {
                calls.push(["update", req.params.id, req.body]);
                res.json({ order: { id: Number(req.params.id), ...req.body } });
            },
            async deleteOrder(req, res) {
                calls.push(["delete", req.params.id]);
                res.json({ message: "deleted" });
            },
            async list(req, res) {
                calls.push(["list"]);
                res.json({ orders: [{ id: 1 }] });
            }
        };
        return { router: orderRoutes(ordersController), calls };
    };

    it("routes order collection and item operations to their controllers", async () => {
        const { router, calls } = createOrderRouter();
        const app = createApp(router, "/orders");
        const order = orderRequest;

        const listResponse = await request(app).get("/orders/all");
        const getResponse = await request(app).get("/orders/7");
        const createResponse = await request(app).post("/orders").send(order);
        const updateResponse = await request(app).put("/orders/7").send({ ...order, quantity: 3 });
        const deleteResponse = await request(app).delete("/orders/7");

        assert.deepEqual(listResponse.body, { orders: [{ id: 1 }] });
        assert.deepEqual(getResponse.body, { order: { id: 7 } });
        assert.equal(createResponse.status, 201);
        assert.deepEqual(createResponse.body, { orderId: 10 });
        assert.deepEqual(updateResponse.body.order, { id: 7, ...order, quantity: 3 });
        assert.deepEqual(deleteResponse.body, { message: "deleted" });
        assert.deepEqual(calls, [
            ["list"],
            ["find", "7"],
            ["create", order],
            ["update", "7", { ...order, quantity: 3 }],
            ["delete", "7"]
        ]);
    });
});

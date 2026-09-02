import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import orderRoutes from "../routers/api/orderRoutes.js";
import authRoutes from "../routers/api/authRoutes.js";
import userRoutes from "../routers/api/userRoutes.js";
import createErrorHandler from "../middleware/errorHandler.js";

import { emptyUserController, emptyUsersController } from "./testUtils.js";
import { signupUser, currentUser, listedUsers } from "./models.test/users.js";
import { orderRequest } from "./models.test/orders.js";

const createApp = (router, path) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

describe("authentication routes", () => {
    it("clears the authentication cookie on logout", async () => {
        const loginController = {
            async checkLogin() {},
            async login() {},
            logout(req, res) {
                res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
                res.json({ message: "Logged out successfully" });
            }
        };
        const userController = { async createUser() {} };
        const app = express();
        app.use(express.json());
        app.post("/logout", loginController.logout.bind(loginController));

        const response = await request(app).post("/logout");

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { message: "Logged out successfully" });
        assert.match(response.headers["set-cookie"][0], /^token=;/);
    });

    it("creates an account through the public signup route", async () => {
        let receivedUser;
        const loginController = {
            async checkLogin() {},
            async login() {}
        };
        const userController = {
            async createUser(req, res) {
                receivedUser = req.body;
                res.status(201).json({ user: { id: 10 } });
            }
        };
        const app = createApp(authRoutes(loginController, userController), "/login");

        const response = await request(app)
            .post("/login/signup")
            .send(signupUser);

        assert.equal(response.status, 201);
        assert.deepEqual(response.body, { user: { id: 10 } });
        assert.deepEqual(receivedUser, {
            name: "Ada Lovelace",
            email: "ada@example.com",
            password: "password123"
        });
    });
});

describe("user routes", () => {
    it("returns the current user from the authenticated identity", async () => {
        let receivedEmail;
        const userController = {
            async getCurrentUser(req, res) {
                receivedEmail = req.currentUser.email;
                res.json({
                    user: { ...currentUser, email: receivedEmail }
                });
            },
            async createUser() {},
            async findUser() {},
            async updateUser() {},
            async deleteUser() {},
            async listOrders() {}
        };
        const usersController = emptyUsersController();
        const app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            req.currentUser = { email: "ada@example.com" };
            next();
        });
        app.use("/users", userRoutes(userController, usersController));

        const response = await request(app).get("/users/me");

        assert.equal(response.status, 200);
        assert.equal(receivedEmail, "ada@example.com");
        assert.deepEqual(response.body.user, {
            name: "Ada Lovelace",
            email: "ada@example.com",
            role: 1
        });
    });

    it("lists users from the users data action", async () => {
        const users = listedUsers;
        const calls = [];
        const userController = emptyUserController();
        const usersController = emptyUsersController();
        usersController.list = async (req, res) => {
            calls.push("listUsers");
            res.json({ users });
        };
        const app = createApp(userRoutes(userController, usersController), "/users");

        const response = await request(app).get("/users/all");

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { users });
        assert.deepEqual(calls, ["listUsers"]);
    });

});

describe("order routes", () => {
    const createOrderRouter = () => {
        const calls = [];
        const orderController = {
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
            }
        };
        const ordersController = {
            async list(req, res) {
                calls.push(["list"]);
                res.json({ orders: [{ id: 1 }] });
            }
        };
        return { router: orderRoutes(orderController, ordersController), calls };
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

describe("error handler", () => {
    it("redirects browser authentication errors without sending JSON afterwards", async () => {
        const app = express();
        const protectedRoute = "/users";
        app.get(protectedRoute, (req, res, next) => next({
            statusCode: 401,
            code: "MISSING_TOKEN",
            message: "Access denied",
            isOperational: true
        }));
        app.use(createErrorHandler());

        const response = await request(app)
            .get(protectedRoute)
            .set("Accept", "text/html");

        assert.equal(response.status, 401);
        assert.match(response.text, /Access denied/);
    });

    it("returns HTTP 500 and delegates shutdown for critical errors", async () => {
        let criticalError;
        const app = express();
        app.get("/critical", (req, res, next) => next({
            statusCode: 600,
            code: "DATABASE_INITIALIZATION_FAILED",
            message: "Database unavailable",
            isOperational: true
        }));
        app.use(createErrorHandler((error) => { criticalError = error; }));

        const response = await request(app).get("/critical");

        assert.equal(response.status, 500);
        assert.deepEqual(response.body, {
            error: { code: "DATABASE_INITIALIZATION_FAILED", message: "Database unavailable" }
        });
        assert.equal(criticalError?.code, "DATABASE_INITIALIZATION_FAILED");
    });
});
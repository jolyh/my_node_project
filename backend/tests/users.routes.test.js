import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import userRoutes from "#routers/api/users.routes";
import { emptyUsersController } from "./test.utils.js";
import { currentUser, listedUsers } from "./models.test/users.js";

const createApp = (router, path) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

describe("user routes", () => {
    it("returns the current user from the authenticated identity", async () => {
        let receivedEmail;
        const usersController = {
            ...emptyUsersController(),
            async getCurrentUser(req, res) {
                receivedEmail = req.currentUser.email;
                res.json({
                    user: { ...currentUser, email: receivedEmail }
                });
            }
        };
        const app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            req.currentUser = { email: "ada@example.com" };
            next();
        });
        app.use("/users", userRoutes(usersController));

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
        const usersController = emptyUsersController();
        usersController.list = async (req, res) => {
            calls.push("listUsers");
            res.json({ users });
        };
        const app = createApp(userRoutes(usersController), "/users");

        const response = await request(app).get("/users/all");

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { users });
        assert.deepEqual(calls, ["listUsers"]);
    });

    it("lists a user's tasks", async () => {
        const tasks = [{ id: 1, title: "Write report" }];
        const calls = [];
        const usersController = emptyUsersController();
        usersController.listTasks = async (req, res) => {
            calls.push(["listTasks", req.params.id]);
            res.json({ tasks });
        };
        const app = createApp(userRoutes(usersController), "/users");

        const response = await request(app).get("/users/7/tasks");

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { tasks });
        assert.deepEqual(calls, [["listTasks", "7"]]);
    });
});

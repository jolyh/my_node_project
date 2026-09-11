import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import taskRoutes from "#routers/api/tasks.routes";
import { emptyTasksController } from "./test.utils.js";
import { taskRequest } from "./models.test/tasks.js";

const createApp = (router, path) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

describe("task routes", () => {
    const createTaskRouter = () => {
        const calls = [];
        const tasksController = {
            ...emptyTasksController(),
            async findTask(req, res) {
                calls.push(["find", req.params.id]);
                res.json({ task: { id: Number(req.params.id) } });
            },
            async createTask(req, res) {
                calls.push(["create", req.body]);
                res.status(201).json({ taskId: 10 });
            },
            async updateTask(req, res) {
                calls.push(["update", req.params.id, req.body]);
                res.json({ task: { id: Number(req.params.id), ...req.body } });
            },
            async deleteTask(req, res) {
                calls.push(["delete", req.params.id]);
                res.json({ message: "deleted" });
            },
            async list(req, res) {
                calls.push(["list"]);
                res.json({ tasks: [{ id: 1 }] });
            },
            async findByAuthorId(req, res) {
                calls.push(["findByAuthorId", req.params.authorId]);
                res.json({ tasks: [{ id: 1, authorId: Number(req.params.authorId) }] });
            }
        };
        return { router: taskRoutes(tasksController), calls };
    };

    it("routes task collection and item operations to their controllers", async () => {
        const { router, calls } = createTaskRouter();
        const app = createApp(router, "/tasks");
        const task = taskRequest;

        const listResponse = await request(app).get("/tasks/all");
        const byAuthorResponse = await request(app).get("/tasks/author/1");
        const getResponse = await request(app).get("/tasks/7");
        const createResponse = await request(app).post("/tasks").send(task);
        const updateResponse = await request(app).put("/tasks/7").send({ ...task, status: 2 });
        const deleteResponse = await request(app).delete("/tasks/7");

        assert.deepEqual(listResponse.body, { tasks: [{ id: 1 }] });
        assert.deepEqual(byAuthorResponse.body, { tasks: [{ id: 1, authorId: 1 }] });
        assert.deepEqual(getResponse.body, { task: { id: 7 } });
        assert.equal(createResponse.status, 201);
        assert.deepEqual(createResponse.body, { taskId: 10 });
        assert.deepEqual(updateResponse.body.task, { id: 7, ...task, status: 2 });
        assert.deepEqual(deleteResponse.body, { message: "deleted" });
        assert.deepEqual(calls, [
            ["list"],
            ["findByAuthorId", "1"],
            ["find", "7"],
            ["create", task],
            ["update", "7", { ...task, status: 2 }],
            ["delete", "7"]
        ]);
    });
});

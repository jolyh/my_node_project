import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import authRoutes from "#routers/api/auth.routes";
import { signupUser } from "./models.test/users.js";

const createApp = (router, path) => {
    const app = express();
    app.use(express.json());
    app.use(path, router);
    return app;
};

describe("authentication routes", () => {
    it("clears the authentication cookie on logout", async () => {
        const authController = {
            async checkLogin() {},
            async login() {},
            logout(req, res) {
                res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
                res.json({ message: "Logged out successfully" });
            }
        };
        const usersController = { async createUser() {} };
        const app = express();
        app.use(express.json());
        app.post("/logout", authController.logout.bind(authController));

        const response = await request(app).post("/logout");

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, { message: "Logged out successfully" });
        assert.match(response.headers["set-cookie"][0], /^token=;/);
    });

    it("creates an account through the public signup route", async () => {
        let receivedUser;
        const authController = {
            async checkLogin() {},
            async login() {},
            async refreshToken() {},
            logout() {}
        };
        const usersController = {
            async createUser(req, res) {
                receivedUser = req.body;
                res.status(201).json({ user: { id: 10 } });
            }
        };
        const app = createApp(authRoutes(authController, usersController), "/login");

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

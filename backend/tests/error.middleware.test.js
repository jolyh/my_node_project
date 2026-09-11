import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import { describe, it } from "node:test";

import createErrorHandler from "#middleware/error.middleware";

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

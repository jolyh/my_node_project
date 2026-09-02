import assert from "node:assert/strict";
import { describe, it } from "node:test";

import User from "../../models/users/user.js";
import userRoles from "../../models/users/roles.js";
import { currentUser, signupUser } from "./users.js";

describe("User model", () => {
    it("maps database columns to the user model", () => {
        const databaseUser = {
            id: 7,
            name: "Ada Lovelace",
            email: "ada@example.com",
            password: "hashed-password",
            role: userRoles.ADMIN,
            created_at: "2030-01-15T12:00:00.000Z",
            updated_at: "2030-01-16T12:00:00.000Z"
        };

        assert.deepEqual(User.new(databaseUser), {
            id: databaseUser.id,
            name: databaseUser.name,
            email: databaseUser.email,
            password: databaseUser.password,
            role: databaseUser.role,
            createdAt: databaseUser.created_at,
            updatedAt: databaseUser.updated_at
        });
    });

    it("builds a creation object and applies the guest default role", () => {
        assert.deepEqual(User.forCreation(signupUser), {
            name: signupUser.name,
            email: signupUser.email,
            password: signupUser.password,
            role: userRoles.GUEST
        });
    });

    it("preserves an explicitly supplied role during creation", () => {
        const user = User.forCreation({ ...signupUser, role: userRoles.ADMIN });

        assert.equal(user.role, userRoles.ADMIN);
    });

    it("builds an update object without accepting a password", () => {
        assert.deepEqual(User.forUpdate({
            ...currentUser,
            password: "should-not-be-updated"
        }), {
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role
        });
    });

    it("sanitizes passwords and hides the guest role", () => {
        const guest = User.sanitize({ id: 1, name: "Guest", password: "secret", role: userRoles.GUEST });
        const admin = User.sanitize({ id: 2, name: "Admin", password: "secret", role: userRoles.ADMIN });

        assert.deepEqual(guest, { id: 1, name: "Guest" });
        assert.deepEqual(admin, { id: 2, name: "Admin", role: userRoles.ADMIN });
    });

    it("converts supported roles to readable names", () => {
        assert.equal(userRoles.toString(userRoles.SYSTEM), "system");
        assert.equal(userRoles.toString(userRoles.ADMIN), "admin");
        assert.equal(userRoles.toString(userRoles.USER), "user");
        assert.equal(userRoles.toString(userRoles.GUEST), "guest");
        assert.equal(userRoles.toString(999), "unknown");
    });

    it("returns user values as an array", () => {
        const user = { name: "Ada", email: "ada@example.com", role: userRoles.USER };

        assert.deepEqual(User.toArray(user), Object.values(user));
    });
});

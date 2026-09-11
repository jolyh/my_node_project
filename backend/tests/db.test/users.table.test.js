import assert from "node:assert/strict";
import { describe, before, beforeEach, test, after } from "node:test";
import { setupDb, resetDb, teardownDb, tables, hasDatabaseConfig } from "#tests/db.test/db.setup";

// Repositories
import UsersRepository from "#repositories/UsersRepository";
// Entities
import { userToCreate } from "#tests/models.test/users";
import User from "#models/users/user";

let dbInstance = null;
let usersTable = null;
let hasUserTable = false;

describe("Users table tests", () => {

    before(async () => {
        dbInstance = await setupDb();

        usersTable = tables.users;
        hasUserTable = hasDatabaseConfig && !!tables.users;
    });

    beforeEach(async () => {
        dbInstance = await resetDb(dbInstance);
    });

    after(async () => {
        console.log("Teardown DB Instance");
        dbInstance = await teardownDb(dbInstance);
        console.log("Teardown completed");
    });

    const noTableSkip = {
        skip: !!hasUserTable ? "tables.users is required for User table tests" : false
    };

    test("Users table exists", async () => {
        assert.equal(hasUserTable, true);
    });

    // The system user should already exist in the users table after initialization
    // We should have exactly one user in the table at the start
    test("Users table has a system user at initialization", noTableSkip, async () => {
        const repository = new UsersRepository(dbInstance);
        const users = await repository.list();
        assert.equal(users.length, 1);
    });

    test("UsersRepository persists data in the Users table", noTableSkip, async () => {
        const repository = new UsersRepository(dbInstance);

        //#region _create
        const userEmail = `test-${Date.now()}@example.com`;
        const userId = await repository.create({
            ...userToCreate,
            email: userEmail
        });
        assert.equal(typeof userId, "number");

        const insertedUser = await repository.findById(userId);
        assert.equal(insertedUser.id, userId);
        assert.equal(insertedUser.name, userToCreate.name);
        assert.equal(insertedUser.email, userEmail);
        assert.equal(insertedUser.password, userToCreate.password);

        // findByEmail
        const foundByEmail = await repository.findByEmail(userEmail);
        assert.equal(foundByEmail.id, userId);
        //#endregion

        //#region _update
        const updatedEmail = `updated-${Date.now()}@example.com`;
        const updatedUser = {
            ...insertedUser,
            name: "Updated Test User",
            email: updatedEmail,
            password: "updated-password" // Password cannot be updated via update() and should remain
        };
        const userToUpdate = User.forUpdate(updatedUser);
        assert.equal(await repository.update(userId, userToUpdate), 1);

        const selectedUpdatedUser = await repository.findById(userId);
        assert.equal(selectedUpdatedUser.name, "Updated Test User");
        assert.equal(selectedUpdatedUser.email, updatedEmail);
        assert.equal(selectedUpdatedUser.password, userToCreate.password);

        // updatePassword
        const newHashedPassword = "new-hashed-password";
        assert.equal(await repository.updatePassword(userId, newHashedPassword), 1);
        const userWithNewPassword = await repository.findById(userId);
        assert.equal(userWithNewPassword.password, newHashedPassword);

        // updateRole
        assert.equal(await repository.updateRole(userId, 2), 1);
        const userWithNewRole = await repository.findById(userId);
        assert.equal(userWithNewRole.role, 2);

        // update non-existent user
        assert.equal(await repository.update(999999, userToUpdate), 0);
        //#endregion

        //#region _delete
        assert.equal(await repository.delete(userId), 1);
        assert.equal(await repository.findById(userId), null);

        // delete non-existent user
        assert.equal(await repository.delete(999999), 0);
        //#endregion

        // The system user should still exist in the users table after all operations
        assert.equal((await repository.list()).length, 1);
    });

});

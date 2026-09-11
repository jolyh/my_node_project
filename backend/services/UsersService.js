import hashUtils from "#utils/hash.utils";
import { runInTransaction } from "#database/db.transaction.runner";
import User from "#models/users/user";
import { AppError, errorTypes } from "#errors/AppError";
import userRoles from "#models/users/roles";

import UsersRepository from "#repositories/UsersRepository";

/**
 * UserService class that handles business logic related to users.
 */
export default class UsersService {

    /**
     * Creates an instance of UsersService.
     * @param {UsersRepository} usersRepository - An instance of UsersRepository for database operations.
     */
    constructor(usersRepository) {
        if (!usersRepository) throw new AppError(
            errorTypes.SERVICE_ERRORS.MISSING_REQUIRED_REPOSITORY,
            "UsersService requires a usersRepository"
        );
        this.repository = usersRepository;
    }

    //#region GET

    /**
     * Lists all users visible to the current user.
     * @param {Object} currentUser - The currently authenticated user.
     * @returns {Array<Object>} List of user objects.
     */
    async listUsers(currentUser) {

        let users = await this.repository.list();

        // Only allow system users to see other system users
        if (currentUser.role !== userRoles.SYSTEM) {
            users = users.filter(user => user.role !== userRoles.SYSTEM);
        }

        if (currentUser.role !== userRoles.ADMIN) {
            // If the current user is not an admin, filter out sensitive information
            return users.map(user => User.sanitize(user));
        }

        return users;
    }

    /**
     * Finds a user by their ID.
     * @param {Object} currentUser - The currently authenticated user.
     * @param {number} id - The ID of the user to find.
     * @returns {Object} The found user object.
     * @throws {AppError} If the user is not found.
     */
    async findUser(currentUser, id) {
        
        const user = await this.repository.findById(id);
        if (!user) {
            throw new AppError(
                errorTypes.API.RESOURCE_NOT_FOUND,
                `User with ID: ${id} not found`
            );
        }
        return User.sanitize(user);
    }

    /**
     * Finds a user by their email address.
     * @param {Object} currentUser - The currently authenticated user.
     * @param {string} email - The email of the user to find.
     * @returns {Object} The found user object.
     * @throws {AppError} If the user is not found.
     */
    async findUserByEmail(currentUser, email) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new AppError(
                errorTypes.API.RESOURCE_NOT_FOUND,
                `User with email: ${email} not found`
            );
        }
        return User.sanitize(user);
    }
    //endregion

    // #region POST/PUT
    /**
     * Creates a new user in the database.
     * @param {Object} currentUser - The currently authenticated user.
     * @param {Object} data - The data for the new user.
     * @returns {number} The ID of the newly created user.
     * @throws {AppError} If the user creation fails or if the provided ID is invalid.
    */
    async createUser(currentUser, data) {
        if (data.id < 1) { // Check for valid user ID and user 0 cannot be created
            throw new AppError(
                errorTypes.API.INVALID_PARAMETER,
                `Invalid user ID: ${data.id}`
            );
        }
        if (data.password) {
            data.password = await hashUtils.password.hash(data.password);
        }
        return await runInTransaction(this.repository.db, async (connection) => {
            const userId = await this.repository.create(data, { connection });
            if (!userId) {
                throw new AppError(
                    errorTypes.USER_ERRORS.CREATION_FAILED,
                    "Failed to create user"
                );
            }
            return userId;
        });
    }

    /**
     * Updates an existing user in the database.
     * @param {Object} currentUser - The currently authenticated user.
     * @param {number} id - The ID of the user to update.
     * @param {Object} data - The data to update for the user.
     * @returns {boolean} True if the user was updated successfully, false otherwise.
     * @throws {AppError} If the user update fails or if the provided ID is invalid.
    */
    async updateUser(currentUser, id, data) {
        if (id < 1) { // Check for valid user ID and user 0 cannot be modified
            throw new AppError(
                errorTypes.API.INVALID_PARAMETER,
                `Invalid user ID: ${id}`
            );
        }
        return await runInTransaction(this.repository.db, async (connection) => {
            const isUpdated = await this.repository.update(id, data, { connection });
            if (!isUpdated) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `User with ID: ${id} not found`
                );
            }
            return isUpdated;
        });
    }

    async updateUserPassword(currentUser, id, oldPassword, newPassword) {
        if (id < 1) { // Check for valid user ID and user 0 cannot be modified
            throw new AppError(
                errorTypes.API.INVALID_PARAMETER,
                `Invalid user ID: ${id}`
            );
        }
        if (await hashUtils.password.compare(newPassword, oldPassword)) {
            throw new AppError(
                errorTypes.USER_ERRORS.PASSWORD_SAME,
                "New password cannot be the same as the old password"
            );
        }
        const newHashedPassword = await hashUtils.password.hash(newPassword);
        return await runInTransaction(this.repository.db, async (connection) => {
            const isUpdated = await this.repository.updatePassword(id, newHashedPassword, { connection });
            if (!isUpdated) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `User with ID: ${id} not found`
                );
            }
            return isUpdated
        });
    }
    // #endregion

    // #region DELETE
    async deleteUser(currentUser, id) {
        if (id < 1) { // Check for valid user ID and user 0 cannot be modified
            throw new AppError(
                errorTypes.API.INVALID_PARAMETER,
                `Invalid user ID: ${id}`
            );
        }
        return await runInTransaction(this.repository.db, async (connection) => {
            const isDeleted = await this.repository.delete(id, { connection });
            if (!isDeleted) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `User with ID: ${id} not found`
                );
            }
            return isDeleted;
        });
    }
    // #endregion
}
import hashUtils from "../utils/hashUtils.js";
import { runInTransaction } from "../utils/dbTransactionRunner.js";
import User from "../models/users/user.js";
import { AppError, errorTypes } from "../errors/AppError.js";
import userRoles from "../models/users/roles.js";

/**
 * UserService class that handles business logic related to users.
 */
export default class UserService {

    /**
     * Creates an instance of UserService.
     * @param {UserRepository} userRepository - An instance of UserRepository for database operations.
     * @param {OrderService} orderService - An instance of OrderService for handling user orders.
     */
    constructor(userRepository) {
        if (!userRepository) throw new AppError(
            errorTypes.SERVICE_ERRORS.MISSING_REQUIRED_REPOSITORY,
            "UserService requires a userRepository"
        );
        this.userRepository = userRepository;
    }

    //#region GET
    async listUsers(currentUser) {

        let users = await this.userRepository.list();

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

    async findUser(currentUser, id) {
        
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError(
                errorTypes.API.RESOURCE_NOT_FOUND,
                `User with ID: ${id} not found`
            );
        }
        return User.sanitize(user);
    }

    async findUserByEmail(currentUser, email) {
        const user = await this.userRepository.findByEmail(email);
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
     * Creates a new user with the provided data.
     * @param {Object} data - The user data for creation.
     * @returns {Object} The created user object.
     */
    async createUser(currentUser, data) {

        if (data.password) {
            data.password = await hashUtils.password.hash(data.password);
        }
        return await runInTransaction(this.userRepository.db, async (connection) => {
            const userId = await this.userRepository.create(data, { connection });
            if (!userId) {
                throw new AppError(
                    errorTypes.USER_ERRORS.CREATION_FAILED,
                    "Failed to create user"
                );
            }
            return userId;
        });
    }

    async updateUser(currentUser, id, data) {
        return await runInTransaction(this.userRepository.db, async (connection) => {
            const isUpdated = await this.userRepository.update(id, data, { connection });
            if (!isUpdated) {
                throw new AppError(
                    errorTypes.API.RESOURCE_NOT_FOUND,
                    `User with ID: ${id} not found`
                );
            }
            return isUpdated
        });
    }

    async updateUserPassword(currentUser, id, oldPassword, newPassword) {
        if (await hashUtils.password.compare(newPassword, oldPassword)) {
            throw new AppError(
                errorTypes.USER_ERRORS.PASSWORD_SAME,
                "New password cannot be the same as the old password"
            );
        }
        const newHashedPassword = await hashUtils.password.hash(newPassword);
        return await runInTransaction(this.userRepository.db, async (connection) => {
            const isUpdated = await this.userRepository.updatePassword(id, newHashedPassword, { connection });
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
        return await runInTransaction(this.userRepository.db, async (connection) => {
            const isDeleted = await this.userRepository.delete(id, { connection });
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
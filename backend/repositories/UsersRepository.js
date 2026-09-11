import User from '#models/users/user';
import { AppError, errorTypes } from '#errors/AppError';
import QueryBuilder from '#database/QueryBuilder';

/**
 * UserRepository class that handles database operations related to users.
 */
class UsersRepository {

    tableName = process.env.DB_USERS_TABLE || "users";

    /**
     * @param {Object} db - The database instance for executing queries.
     */
    constructor(db) {
        if (!db) throw new AppError(
            errorTypes.INTERNAL_ERRORS.REPOSITORY_MISSING_REQUIRED_DB,
            "UsersRepository requires a valid database instance"
        );
        this.db = db;
        this.queryBuilder = new QueryBuilder(this.tableName); // Initialize queryBuilder
    }

    //#region GET

    async list(options = {}) {
        const client = options.connection || this.db; // Use provided client or default to this.db
        const { query, values } = this.queryBuilder.select().toSQL();
        const [rows] = await client.execute(query, values);
        const users = rows.map(row => User.new(row));
        return users;
    }

    async listFromId(startingId = 1, options = {}) {

        // System user is always ID 0, so we start from 1 if the provided startingId is less than 1
        if (startingId < 1) {
            startingId = 1; // Ensure startingId is at least 1
        }

        const client = options.connection || this.db; // Use provided client or default to this.db
        const { query, values } = this.queryBuilder
            .select()
            .where('id', '>=', startingId)
            .toSQL();
        const [rows] = await client.execute(query, values);
        const users = rows.map(row => User.new(row));
        return users;
    }

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @param {Object} options - Optional parameters, including a database connection.
     * @returns {Promise<User|null>} The user object if found, otherwise null.
     */
    async findById(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('id', '=', id)
            .limit(1)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows[0] ? User.new(rows[0]) : null;
    }

    async findByEmail(email, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('email', '=', email)
            .limit(1)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows[0] ? User.new(rows[0]) : null;
    }
    //endregion

    //#region CREATE/UPDATE
    async create(user, options = {}) {
        const client = options.connection || this.db; // Use provided client or default to this.db
        const { query, values } = this.queryBuilder
            .insert(user)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.insertId;
    }

    /**
     * Updates an existing user in the database.
     * Does not update the password; use updatePassword for that.
     * Because we use '+FOUND_ROWS' if the update return 0, the user doesn't exist.
     * If it returns 1, the user was updated successfully (even if nothing changed).
     * @param {User} user - The user object containing updated data.
     * @param {Object} options - Optional parameters, including a database connection.
     * @returns {Promise<number>} The number of affected rows. 0 if no user was updated, 1 if the user was successfully updated.
     * @throws {Error} Throws an error if the update operation fails.
    */
    async update(id, user, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .update(user)
            .where('id', '=', id)
            .toSQL();
        const [header] = await client.execute(query, values);
        return header.affectedRows;
    }

    /**
     * Updates the password of an existing user in the database.
     * Because we use '+FOUND_ROWS' if the update return 0, the user doesn't exist.
     * If it returns 1, the user was updated successfully (even if nothing changed).
     * @param {number} id - The ID of the user whose password is to be updated.
     * @param {string} newPassword - The new password to be set for the user.
     * @param {Object} options - Optional parameters, including a database connection.
     * @returns {Promise<number>} The number of affected rows. 0 if no user was updated, 1 if the password was successfully updated.
     * @throws {Error} Throws an error if the update operation fails.
     */
    async updatePassword(id, newPassword, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .update({ password: newPassword })
            .where('id', '=', id)
            .toSQL();
        const [header] = await client.execute(query, values);
        return header.affectedRows;
    }
    //#endregion

    async updateRole(id, newRole, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .update({ role: newRole })
            .where('id', '=', id)
            .toSQL();
        const [header] = await client.execute(query, values);
        return header.affectedRows;
    }

    //#region DELETE
    async delete(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .delete()
            .where('id', '=', id)
            .toSQL();
        const [header] = await client.execute(query, values);
        return header.affectedRows;
    }
    //endregion

}

export default UsersRepository;
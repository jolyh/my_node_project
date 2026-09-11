import Table from "#database/tables/Table";
import Logger from '#utils/Logger';
import userRoles from '#models/users/roles';
import hashUtils from '#utils/hash.utils';
import { AppError, errorTypes } from "#errors/AppError";

const usersColumns = {
    id: {
        query: "id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    },
    name: {
        query: "name VARCHAR(255) NOT NULL",
    },
    email: {
        query: "email VARCHAR(255) NOT NULL UNIQUE", 
    },
    password: {
        query: "password VARCHAR(255) NOT NULL",
        encrypted: true,
    },
    role: {
        query: `role INT UNSIGNED NOT NULL DEFAULT ${userRoles.default()}`,
    },
    created_at: {
        query: "created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3)",
    },
    updated_at: {
        query: "updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)",
    },
    toArray: function() {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

const usersConstraints = {
    toArray: function() {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

class UsersTable extends Table {

    static usersTableColumns = usersColumns;
    static usersConstraints = usersConstraints;

    constructor(tableName = "users") {
        super(tableName, usersColumns, usersConstraints);
    }

    setup = async (dbInstance) => {

        // Check if the users table exists
        const exists = await this.checkSelfExists(dbInstance);

        if (exists) {
            Logger.systemInfo(`Users table already exists: ${this.tableName} - skipping creation.`);
            
            const { query: verifySystemUser, values: verifySystemUserValues } = this.queryBuilder
                .select(['id'])
                .where('id', '=', process.env.SYSTEM_USER_ID || 0)
                .toSQL();
            
            const [row] = await dbInstance.execute(verifySystemUser, verifySystemUserValues);
            if (row.length > 0) {
                Logger.systemInfo(`System user exists in the users table: ${this.tableName}`);
            } else {
                Logger.systemInfo(`System user is missing in the users table: ${this.tableName}`);
                throw new AppError(
                    errorTypes.CRITICAL.DATABASE_SYSTEM_USER_MISSING,
                    `System user is missing in the users table: ${this.tableName}`
                );
            }
            return;
        }

        await this.createSelf(dbInstance);

        // Create System Admin User if it doesn't exist
        await this.createSystemUser(dbInstance);
    };

    createSystemUser = async (dbInstance) => {

        // To allow inserting a user with ID 0 (for system user), 
        // we need to disable the auto-increment check temporarily
        const connection = await dbInstance.getConnection();
        await connection.query(`SET @@session.sql_mode = CONCAT(@@session.sql_mode, ',NO_AUTO_VALUE_ON_ZERO');`);

        const systemUser = {
            id: process.env.SYSTEM_USER_ID ? parseInt(process.env.SYSTEM_USER_ID) : 0,
            name: process.env.SYSTEM_USER_NAME || 'system',
            email: process.env.SYSTEM_USER_EMAIL || 'system@example.com',
            role: process.env.SYSTEM_USER_ROLE ? parseInt(process.env.SYSTEM_USER_ROLE) : 99,
        };
        systemUser.password = await hashUtils.password.hash(process.env.SYSTEM_USER_PASSWORD || 'system_password');
        
        const { query, values } = this.queryBuilder.insert(systemUser).toSQL();
        const [result] = await connection.query(query, values);

        connection.release();

        const systemUserCreated = result.affectedRows > 0;
        if (!systemUserCreated) {
            throw new AppError(
                errorTypes.CRITICAL.DATABASE_SYSTEM_USER_CREATION_FAILED,
                `Failed to create system user in the users table: ${this.tableName}`
            );
        }
    };

}

export default UsersTable;
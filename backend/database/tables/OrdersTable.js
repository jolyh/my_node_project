import Logger from '#utils/Logger';
import QueryBuilder from "#database/QueryBuilder";
import { AppError, errorTypes } from "#errors/AppError";
import Table from "#database/tables/Table";

const ordersColumns = {
    id: {
        query: "id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    },
    user_id: {
        query: "user_id INT UNSIGNED",
    },
    product_id: {
        query: "product_id INT UNSIGNED NOT NULL",
    },
    quantity: {
        query: "quantity INT UNSIGNED NOT NULL DEFAULT 1",
    },
    total_price: {
        query: "total_price DECIMAL(10, 2) NOT NULL",
    },
    status: {
        query: "status INT UNSIGNED NOT NULL DEFAULT 0",
    },
    created_at: {
        query: "created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3)",
    },
    updated_at: {
        query: "updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)",
    },
    delivery_date: {
        query: "delivery_date TIMESTAMP(3) NULL",
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

const ordersConstraints = {
    fk_orders_user: {
        query: `CONSTRAINT fk_orders_user 
            FOREIGN KEY (user_id) 
            REFERENCES users(id) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE`,
    },
    toArray: function () {
        return Object.values(this)
            .filter(value => typeof value === 'object' && value.query)
            .map(value => value.query);
    }
};

class OrdersTable extends Table {

    static ordersColumns = ordersColumns;
    static ordersConstraints = ordersConstraints;

    constructor(
        tableName = "orders",
        userTableName = "users"
    ) {
        super(tableName, ordersColumns, ordersConstraints);
        this.userTableName = userTableName;
    }

    setup = async (dbInstance) => {

        await this.checkIfUsersTableExists(dbInstance, this.userTableName);

        // Check if the order table exists
        const exists = await this.checkSelfExists(dbInstance);

        if (exists) {
            Logger.systemInfo(`Orders table already exists: ${this.tableName} - skipping creation.`);
            return;
        }

        await this.createSelf(dbInstance);
    };

    checkIfUsersTableExists = async (dbInstance, userTableName) => {
        const { query: checkQuery, values: checkValues } = new QueryBuilder(userTableName)
            .show()
            .toSQL();
        const [result] = await dbInstance.execute(checkQuery, checkValues);
        if (result.length === 0) {
            throw new AppError(
                errorTypes.DB.REQUIRED_TABLE_MISSING,
                `Users table does not exist: ${userTableName}. Orders table requires the users table to exist.`
            );
        }
    };

}

export default OrdersTable;
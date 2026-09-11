import Order from '#models/orders/order';
import { AppError, errorTypes } from '#errors/AppError';
import QueryBuilder from '#database/QueryBuilder';

/**
 * OrderRepository class that handles database operations related to orders.
 */
class OrdersRepository {

    tableName = process.env.DB_ORDERS_TABLE || "orders";

    /**
     * @param {Object} db - The database instance for executing queries.
     */
    constructor(db) {
        if (!db) throw new AppError(
            errorTypes.CRITICAL_ERRORS.REPOSITORY_MISSING_REQUIRED_DB,
            "OrdersRepository requires a valid database instance"
        );
        this.db = db;
        this.queryBuilder = new QueryBuilder(this.tableName); // Initialize queryBuilder
    }

    //#region GET
    async list(options = {}) {
        const client = options.connection || this.db; // Use provided client or default to this.db
        const { query } = this.queryBuilder
            .select()
            .toSQL();
        const [rows] = await client.execute(query, []);
        const orders = rows.map(row => Order.new(row));
        return orders;
    }

    async getById(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('id', '=', id)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows[0] ? Order.new(rows[0]) : null;
    }

    async getByUserId(userId, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .select()
            .where('user_id', '=', userId)
            .toSQL();
        const [rows] = await client.execute(query, values);
        return rows.map(row => Order.new(row));
    }
    //endregion

    //#region CREATE/UPDATE
    async create(order, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .insert(order)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.insertId;
    }

    async update(id, order, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .update(order)
            .where('id', '=', id)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.affectedRows;
    }
    //#endregion

    //#region DELETE
    async delete(id, options = {}) {
        const client = options.connection || this.db;
        const { query, values } = this.queryBuilder
            .delete()
            .where('id', '=', id)
            .toSQL();
        const [result] = await client.execute(query, values);
        return result.affectedRows;
    }
    //endregion

}

export default OrdersRepository;
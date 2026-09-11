import mysql from 'mysql2/promise';
import config from '#configs/config';
import database from '#database/database';
import { AppError, errorTypes } from '#errors/AppError';

/**
 * Creates a database instance with methods to interact with the database.
 * @param {Object} options - Configuration options for the database instance.
 * @param {string} options.databaseName - The name of the database to connect to.
 * @param {boolean} options.nukeOnInit - Whether to reset the database on initialization.
 * @returns {mysql.Pool} The database instance with methods to interact with the database.
 */
const createDbInstance = ({
  databaseName = process.env.DB_NAME,
  nukeOnInit = process.env.NUKE_DATABASE_ON_INIT === 'true'
} = {}) => {

  let poolInstance = null;
  const requirePool = () => {
    if (!poolInstance) throw new AppError(
      errorTypes.DATABASE_INITIALIZATION_FAILED, 
      'Database not initialized! Call init() first.'
    );
    return poolInstance;
  };

  /**
   * @returns {Object} The database instance with methods to interact with the database.
   * The returned object provides methods to initialize the database, obtain connections, check initialization status, close the pool, and execute queries.
   */
  const dbInstance = {

    /**
     * Initialize the database instance.
     */
    async init() {
      if (poolInstance) return;
      if (!databaseName) throw new AppError(
        errorTypes.DATABASE_INITIALIZATION_FAILED,
        'A database name is required to initialize the database'
      );
      if (nukeOnInit && process.env.NODE_ENV !== 'test') {
        throw new AppError(
          errorTypes.DATABASE_RESET_NOT_ALLOWED,
          'Database reset is only allowed when NODE_ENV is test'
        );
      }

      const dbConfig = {
        host: process.env.DB_ADDR,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: databaseName,
        port: process.env.DB_PORT,
        waitForConnections: true,
        enableKeepAlive: config.db.DB_ENABLE_KEEP_ALIVE || true,
        keepAliveInitialDelay: config.db.DB_KEEP_ALIVE_INITIAL_DELAY || 10000,
        connectTimeout: config.db.DB_CONNECT_TIMEOUT || 10000,
        connectionLimit: config.db.DB_CONNECTION_LIMIT || 10,
        queueLimit: config.db.DB_QUEUE_LIMIT || 0,
        flags: config.db.FLAGS || '+FOUND_ROWS'
      };

      poolInstance = mysql.createPool(dbConfig);
      await dbInstance.reset();
    },

    //#region Pool Connection

    /**
     * Get a connection from the database connection pool.
     * @returns {Promise<mysql.PoolConnection>} A Promise that resolves to a connection from the pool.
     */
    async getConnection() {
      return requirePool().getConnection();
    },

    /**
     * Check if the database connection pool is initialized.
     * @returns {boolean} True if the pool is initialized, false otherwise.
     */
    isInitialized() {
      return !!poolInstance;
    },

    /**
     * Close the database connection pool.
     */
    async close() {
      if (poolInstance) {
        await poolInstance.end();
        poolInstance = null;
      }
    },

    //#endregion

    //#region Query and Execute Methods

    /**
     * Request a Promise-based connection from the pool then execute .query with optional parameters.
     * @param {string} sql - The SQL query to execute.
     * @param {Array} [params] - The optional parameters for the SQL query.
     * @returns {Promise<mysql.PoolConnection>} A Promise that resolves to a connection from the pool.
     */
    async query(sql, params) {
      return requirePool().query(sql, params);
    },

    /**
     * Request a Promise-based connection from the pool then execute .execute with optional parameters.
     * @param {string} sql - The SQL query to execute.
     * @param {Array} [params] - The optional parameters for the SQL query.
     * @returns {Promise<mysql.PoolConnection>} A Promise that resolves to a connection from the pool.
     */
    async execute(sql, params) {
      const result = await requirePool().execute(sql, params);
      return result;
    },
    //#endregion

    /**
     * Reset the database by either nuking and recreating it (in test environment) or creating it if it doesn't exist.
     * Ensures the database is ready for use and sets up the necessary tables.
     */
    async reset() {
      if (nukeOnInit && process.env.NODE_ENV === 'test') 
        await database.nukeAndRecreate(databaseName);
      else
        await database.createIfNotExists(databaseName);
      await poolInstance.execute('SELECT 1');
      await database.setupTables(poolInstance);
    },

    async teardown() {
      if (poolInstance) {
        await poolInstance.end();
        poolInstance = null;
      }
    }
  };

  return Object.freeze(dbInstance);
};

const dbInstance = createDbInstance();

export { createDbInstance };
export default dbInstance;

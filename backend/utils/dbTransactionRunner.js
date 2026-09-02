import { AppError, errorTypes } from '../errors/AppError.js';
/**
 * Executes a set of database operations within a safe MySQL transaction.
 * @param {import('mysql2/promise').Pool} db - The MySQL connection pool.
 * @param {Function} txCallback - Async function containing your queries. Receives the dedicated connection.
 * @returns {Promise<any>} Yields the output returned by the callback function.
 */
export const runInTransaction = async (db, txCallback) => {
  // 1. Acquire an isolated connection thread from the pool
  const connection = await db.getConnection();
  
  try {
    // 2. Open the SQL transaction block
    await connection.beginTransaction();

    // 3. Execute the custom business instructions, forwarding the connection hook
    const result = await txCallback(connection);

    // 4. Commit changes if no internal rejections occur
    await connection.commit();
    return result;

  } catch (error) {
    // 5. Instantly roll back row changes if any query fails
    await connection.rollback();
    throw new AppError(
      errorTypes.API.RESOURCE_MODIFICATION_FAILED,
      error
    );
  } finally {
    // 6. Guarantee connection delivery back to the pool to prevent thread leaks
    connection.release();
  }
};

export default { runInTransaction };
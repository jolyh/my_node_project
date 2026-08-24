import assert from "node:assert/strict";
import { describe, it } from "node:test";

import QueryBuilder from "../internal/database/QueryBuilder.js";

describe("QueryBuilder", () => {
	it("builds a default select query", () => {
		const builder = new QueryBuilder("users");

		assert.deepEqual(builder.toSQL(), {
			query: "SELECT * FROM users",
			values: []
		});
	});

	it("builds select queries with selected fields", () => {
		const query = new QueryBuilder("users")
			.select(["id", "name"])
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT id, name FROM users",
			values: []
		});
	});

	it("builds insert queries and preserves object value order", () => {
		const query = new QueryBuilder("users")
			.insert({ name: "Ada", age: 36 })
			.toSQL();

		assert.deepEqual(query, {
			query: "INSERT INTO users (name, age) VALUES (?, ?)",
			values: ["Ada", 36]
		});
	});

	it("builds update queries with a where clause", () => {
		const query = new QueryBuilder("users")
			.update({ name: "Grace", role: 1 })
			.where("id", 7)
			.toSQL();

		assert.deepEqual(query, {
			query: "UPDATE users SET name = ?, role = ? WHERE id = ?",
			values: ["Grace", 1, 7]
		});
	});

	it("builds delete queries with a where clause", () => {
		const query = new QueryBuilder("users")
			.delete()
			.where("id", "=", 7)
			.toSQL();

		assert.deepEqual(query, {
			query: "DELETE FROM users WHERE id = ?",
			values: [7]
		});
	});

	it("builds create, drop, and show queries", () => {
		assert.equal(
			new QueryBuilder("users").create(["id INT", "name TEXT"]).toSQL().query,
			"CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)"
		);
		assert.equal(
			new QueryBuilder("users").create([], [], false).toSQL().query,
			"CREATE TABLE users"
		);
		assert.equal(
			new QueryBuilder("users").drop().toSQL().query,
			"DROP TABLE IF EXISTS users"
		);
		assert.equal(
			new QueryBuilder("users").drop(false).toSQL().query,
			"DROP TABLE users"
		);
		assert.equal(
			new QueryBuilder("users").show().toSQL().query,
			"SHOW TABLES LIKE 'users'"
		);
	});

	it("supports shorthand and explicit where predicates", () => {
		const query = new QueryBuilder("users")
			.select(["id", "name"])
			.where("role", 1)
            .and()
			.where("name", "LIKE", "A%")
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT id, name FROM users WHERE role = ? AND name LIKE ?",
			values: [1, "A%"]
		});
	});

	it("combines whereOr predicates with OR", () => {
		const query = new QueryBuilder("users")
			.where("role", 1)
            .or()
			.where("role", 2)
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM users WHERE role = ? OR role = ?",
			values: [1, 2]
		});
	});

	it("supports explicit AND and OR connectors", () => {
		const query = new QueryBuilder("users")
			.where("role", 1)
			.or()
			.where("role", 2)
			.and()
			.where("active", true)
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM users WHERE role = ? OR role = ? AND active = ?",
			values: [1, 2, true]
		});
	});

	it("supports whereIn, whereNotIn, and whereNull", () => {
		const query = new QueryBuilder("users")
			.whereIn("id", [1, 2, 3])
            .and()
			.whereNotIn("role", [0])
            .and()
			.whereNull("deleted_at")
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM users WHERE id IN (?, ?, ?) AND role NOT IN (?) AND deleted_at IS NULL",
			values: [1, 2, 3, 0]
		});
	});

	it("supports not-null and range predicates", () => {
		const query = new QueryBuilder("orders")
			.whereNotNull("delivery_date")
            .and()
			.whereBetween("total_price", 10, 100)
            .and()
			.whereNotBetween("quantity", 5, 10)
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM orders WHERE delivery_date IS NOT NULL AND total_price BETWEEN ? AND ? AND quantity NOT BETWEEN ? AND ?",
			values: [10, 100, 5, 10]
		});
	});

	it("supports LIKE predicates", () => {
		const query = new QueryBuilder("users")
			.whereLike("name", "A%")
            .and()
			.whereNotLike("email", "%@invalid.test")
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM users WHERE name LIKE ? AND email NOT LIKE ?",
			values: ["A%", "%@invalid.test"]
		});
	});

	it("supports EXISTS and NOT EXISTS predicates", () => {
		const query = new QueryBuilder("users")
			.whereExists("SELECT 1 FROM orders WHERE orders.user_id = users.id")
            .and()
			.whereNotExists("SELECT 1 FROM bans WHERE bans.user_id = users.id")
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM users WHERE EXISTS (SELECT 1 FROM orders WHERE orders.user_id = users.id) AND NOT EXISTS (SELECT 1 FROM bans WHERE bans.user_id = users.id)",
			values: []
		});
	});

	it("supports raw conditions and keeps raw parameter order", () => {
		const query = new QueryBuilder("orders")
			.whereRaw("total_price >= ?", [25])
            .and()
			.where("status", 2)
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT * FROM orders WHERE total_price >= ? AND status = ?",
			values: [25, 2]
		});
	});

	it("rejects empty or non-array IN values", () => {
		const builder = new QueryBuilder("users");

		assert.throws(() => builder.whereIn("id", []), /non-empty array/);
		assert.throws(() => builder.whereIn("id", 1), /non-empty array/);
		assert.throws(() => builder.whereNotIn("id", []), /non-empty array/);
		assert.throws(() => builder.whereNotIn("id", "1"), /non-empty array/);
	});

	it("supports joins, ordering, and limits", () => {
		const query = new QueryBuilder("orders")
			.select(["orders.id", "users.name"])
			.join("users", "orders.user_id", "users.id")
			.orderBy("orders.id", "DESC")
			.limit(10)
			.toSQL();

		assert.deepEqual(query, {
			query: "SELECT orders.id, users.name FROM orders INNER JOIN users ON orders.user_id = users.id ORDER BY orders.id DESC LIMIT 10",
			values: []
		});
	});

	it("supports explicit join operators and join types", () => {
		const query = new QueryBuilder("orders")
			.join("users", "orders.user_id", "=", "users.id", "LEFT")
			.toSQL();

		assert.equal(
			query.query,
			"SELECT * FROM orders LEFT JOIN users ON orders.user_id = users.id"
		);
	});

	it("resets query state and remains chainable", () => {
		const builder = new QueryBuilder("users")
			.where("id", 1)
			.orderBy("id")
			.limit(1);

		assert.equal(builder.reset(), builder);
		assert.deepEqual(builder.toSQL(), {
			query: "SELECT * FROM users",
			values: []
		});
	});
});

# Project Improvement Review

Scope: `my_node_project`, excluding `learning/` and `node_modules/`.

## Current Review - 2026-08-20

The order API contract and logging infrastructure have changed since the historical notes below. This section is the current source of truth; the remaining sections are retained as context and should not be treated as an active implementation plan.

### Highest Priority

#### 1. System audit logs violate the user foreign key and are silently discarded

**Locations:** `internal/services/AuditLogService.js`, `internal/database/queries/auditLogsTable.js`, `internal/utils/auditLogger.js`

`AuditLogService` uses `0` as the default `authorId`, while `audit_logs.author_id` has a foreign key to positive `users.id` values. System entries therefore fail to insert after the logger is configured. `auditLogger` suppresses those failures with `.catch(() => {})`, so records disappear without a diagnostic.

Update: default system entries to `null` (the schema permits it), pass an author ID only for authenticated actions, and test both system and user audit records. Define a failure policy: await business-audit writes or provide a non-recursive `stderr` fallback for best-effort diagnostics.

#### 2. Completed: critical error shutdown ownership and browser redirects

**Locations:** `internal/middleware/errorHandler.js`, `internal/routers/router.js`, `index.js`, `test/routes.test.js`

The error handler now receives an `onCriticalError` callback from the application router. `index.js` supplies the callback through its existing `gracefulShutdown(1)` function, which owns the HTTP server. Critical application errors respond with HTTP `500` before shutdown is initiated, rather than exposing invalid $6xx statuses.

Browser authentication redirects return immediately, avoiding a second JSON response. Focused tests cover the redirect and critical-shutdown callback behavior.

### Security and Correctness

#### 4. Login audit messages contain email addresses

**Locations:** `internal/controllers/auth/AuthController.js`, `internal/services/AuthService.js`

The prior header/body/cookie/token logging has been removed, which is a material improvement. Login-related audit entries still include the submitted email address. Prefer an authenticated user ID; for failed login events, retain only a request ID or a one-way normalized identifier when operationally required.

#### 6. Order routes lack request validation

**Location:** `internal/routers/api/orderRoutes.js`

The order controller/service/route contracts are now aligned, but validation remains a TODO. Add input rules for IDs and the order DTO: `userId`, `productId`, `quantity`, `totalPrice`, `status`, and `deliveryDate`.

### Completed Since the Historical Review

- Request auditing now records only request ID, method, and URL; it no longer records headers, cookies, bodies, JWTs, or passwords.
- Shared audit logger, service, repository, table, and severity types are present.
- Order create/update now use `userId`, `productId`, `quantity`, `totalPrice`, `status`, and `deliveryDate` consistently.
- Order service, controller, and route method names are aligned.
- The project-wide backend syntax check completed successfully.

### Recommended Sequence

1. Fix the audit `authorId` default, remove the repository console call, and add audit persistence tests.
2. Completed: error-handler shutdown ownership and browser auth redirects.
3. Define audit delivery guarantees, including queue bounds and write-failure behavior.
4. Add order validation and focused route/error tests.

## Historical Review

The remaining notes predate the current audit and order-contract work. They are useful background only.

## Executive Summary

The project has a useful layered shape (`routers -> controllers -> services -> repositories`), a working native ESM setup, and integration tests that exercise real MySQL CRUD. The main maintenance problem is that the active path and several older paths have drifted apart. There are duplicate controller abstractions, unused database APIs, inconsistent service method contracts, and request behavior that is difficult to reason about from logs alone.

The recommended direction is:

1. Make the active HTTP path internally consistent and remove dead alternatives.
2. Treat passwords and credentials as sensitive data everywhere, including responses and logs.
3. Keep one database-instance factory, one schema setup path, and a test pool configured with `TEST_DB_NAME`.
4. Add a small shared async/error/response convention.
5. Expand tests around authentication, validation, errors, and the order path before adding features.

## Highest Priority

### 1. Remove credentials and tokens from logs

**Confirmed location:** `internal/middleware/requestMiddleware.js`

The middleware logs complete headers, request bodies, and cookies. This can record:

- `Authorization` bearer tokens
- the `token` cookie
- login/signup passwords
- database or user data sent in requests

This is unsafe in local logs and especially unsafe in centralized production logging.

Recommended change:

- Replace request-body/header/cookie dumps with a structured request summary.
- Redact `authorization`, `cookie`, `password`, and token-like fields.
- Use a configurable logger with levels instead of scattered `console.log` calls.
- Keep request ID, method, path, status, duration, and safe user/request metadata.

### 2. Fix or remove the broken order controller path

**Locations:**

- `internal/controllers/orders/OrderController.js`
- `internal/controllers/orders/OrdersController.js`
- `internal/services/OrderService.js`
- `internal/routers/orderRoutes.js`

The active `orderRoutes.js` calls `listOrders()` and `findOrder()`. `OrderController` calls `getOrderById()`. `OrdersController` calls `getAllOrders()` and `getOrdersByUserId()`. `OrderService` implements `listOrders()`, `findOrder()`, and `findOrdersByUserId()`.

These are incompatible contracts. The application currently bypasses the two controller classes for most order routes, which hides the problem until someone wires them in.

Recommended change:

- Choose one order design: controller methods plus route registration, or route handlers directly delegating to a service.
- Prefer controllers for consistency with users/auth.
- Rename service calls to one vocabulary (`list`, `getById`, `getByUserId`, `create`, `update`, `remove`) and update all callers together.
- Delete the unused controller class after the active path is migrated.
- Add order route tests for list, get, create, update, delete, and not-found behavior.

### 3. Implement or remove nested user-order routes

**Locations:**

- `internal/routers/userRoutes.js`
- `internal/controllers/users/UsersController.js`

The router calls `usersController.listUserOrders()`, `createUserOrder()`, and `cancelUserOrder()`. `UsersController` currently implements only `get()`. These routes therefore fail when invoked.

Recommended change:

- Either implement the three methods with an injected order service/repository, or remove the nested routes until order ownership is designed.
- Do not leave route registrations for methods that are absent from the injected controller.
- Add route tests for success and not-found cases if the feature remains.

## Significant Maintainability Issues

### 4. Add a real schema migration boundary

**Locations:** `internal/database/setup/`, `internal/database/queries/queries.js`

The users table is created with `CREATE TABLE IF NOT EXISTS`, but existing tables are not upgraded if a column or constraint changes. This is schema bootstrapping, not migration.

Recommended change:

- Use versioned migrations for changes after the initial schema.
- Keep table definitions in one place.
- Add a schema verification test for required columns and constraints.
- Add the orders table migration before enabling order CRUD.

### 5. Standardize service contracts and constructor dependencies

**Locations:**

- `internal/services/services.js`
- `internal/services/UserService.js`
- `internal/services/OrderService.js`
- `internal/services/AuthService.js`

`OrderService` is constructed with `(db, repositories.orderRepository)` but its constructor accepts only an order repository. `UserService` stores both `db` and repository because it owns transactions. Auth uses only the repository. The inconsistent constructor shapes make dependency wiring harder to read.

Recommended change:

- Define each service constructor around the dependencies it actually uses.
- Either give every write-capable service a transaction runner/database dependency or move transaction ownership into repositories.
- Rename methods consistently across service/controller/router layers.
- Avoid `try/catch` blocks in factory functions that call `process.exit(1)`; throw the original error and let the application entry point decide how to terminate.

### 6. Correct user model/repository mapping and role handling

**Locations:**

- `internal/repositories/UserRepository.js`
- `internal/models/users/user.js`
- `internal/models/users/roles.js`
- `internal/database/queries/queries.js`

The model supports `role`, `createdAt`, and `updatedAt`, but repository mapping should be treated as the single source of truth and tested explicitly. Role defaults are implicit in `User.new()` and database defaults, while validation does not clearly define who may assign a role.

Recommended change:

- Map all persisted fields deliberately, including role and timestamps.
- Never accept a client-supplied elevated role during signup or ordinary user update.
- Add role authorization rules separate from field validation.
- Test default role behavior and ensure public user responses expose only the role, not internal fields.

### 7. Fix order service update semantics

**Location:** `internal/services/OrderService.js`

`updateOrder(updateOrder)` looks up `updateOrder.id`, while the route calls `updateOrder(orderId, orderToUpdate)`. The second argument is ignored, so update requests cannot work through this service contract. The service also mixes camelCase and database snake_case fields.

Recommended change:

- Use one signature: `updateOrder(id, data)`.
- Map API fields to repository fields in one layer.
- Avoid mutating an object returned from a repository; create an explicit update object.
- Add a test that verifies the ID, changed fields, and not-found path.

## Security and Configuration

### 8. Rotate and protect local secrets

`.env` exists locally and contains a JWT key and database credentials. `.gitignore` correctly ignores `.env`, but verify with `git ls-files .env` that it has never been committed. If it has been committed or shared, rotate every exposed credential. Add a committed `.env.example` containing variable names only.

Required configuration checks should cover:

- `JWT_KEY` length and presence
- `DB_ADDR`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT`
- `TEST_DB_NAME` for integration tests
- production-only secure cookie requirements

### 9. Add security headers and auth tests around logout/current-user behavior

The protected-page fallback now logs out when `/users/me` fails, which is useful UX, but it should be backed by tests for expired/invalid tokens and missing users. Also ensure logout clears the cookie with the same path/domain attributes used when setting it.

## Readability and Redundancy Cleanup

### 10. Remove dead imports and duplicated comments

Examples confirmed during review:

- `userHandler` is imported but unused in `userRoutes.js`.
- `config` is imported but unused in `authRoutes.js`.
- `AppError`/`errorTypes` imports are unused in `UsersController.js`.
- Region comments (`//#region`, `//#endregion`) add noise around short modules.
- Comments frequently restate the next line instead of documenting a non-obvious decision.

Remove these after each module has one clear responsibility. Keep comments only for invariants such as test-pool isolation or cookie/security decisions.

### 11. Replace noisy console logging with structured logging

There are logs in routers, services, repositories, auth, database setup, and request middleware. Logging at every layer duplicates the same event and makes production output hard to search.

Recommended baseline:

- One request log at middleware level with request ID, method, path, status, and duration.
- One error log at the global error handler with stack and request ID.
- Domain logs only for important lifecycle events.
- Never log request bodies, cookies, authorization headers, passwords, or full records.

## Testing and CI

### 12. Add missing behavioral coverage

Current tests cover route forwarding and users-table CRUD, but gaps remain:

- Auth middleware: missing, malformed, expired, cookie, and bearer tokens.
- Login success/failure and cookie attributes.
- Signup validation and duplicate email.
- `/users/me` failure and logout fallback.
- User not-found, update, delete, and password hashing.
- Order controller/service/repository behavior.
- Database startup safety: test reset allowed, non-test reset rejected.
- Error handler formatting.

### 13. Make database tests isolated and deterministic

The test pool factory is the right direction. Keep using `TEST_DB_NAME` and the normal `users` table name. Add a test-level cleanup that drops the test database or table even when CRUD assertions fail, and ensure the pool closes in `finally`. Avoid running destructive integration tests concurrently against the same database.

### 14. Improve CI usefulness

`.github/workflows/pr-review-checks.yml` runs tests but does not provide database credentials or a MySQL service, so the integration test may skip or fail depending on environment. It also has no configured lint command because `package.json` has no `lint` script.

Recommended change:

- Add a MySQL service container to CI.
- Create a dedicated CI `.env` from non-secret test values.
- Run database tests against `TEST_DB_NAME`.
- Add ESLint and a `lint` script.
- Add formatting/check scripts.
- Fail CI if required tests are skipped unexpectedly.

### 15. Split route tests from integration tests

Keep fast route tests independent of MySQL. Put database tests under an explicit integration command such as `npm run test:integration`, while `npm test` runs unit/route tests. CI can then run both with clear prerequisites.

## Suggested Cleanup Sequence

### Phase 1: Safety and correctness

1. Redact request logs and rotate/verify secrets.
2. Remove or implement nested user-order routes.
3. Fix the order service/controller contract mismatch.
4. Add authentication and error-path tests.

### Phase 2: Simplification

1. Delete unused controllers, imports, and database helpers.
2. Standardize service method names and constructor dependencies.
3. Introduce structured logging and a shared error format.

### Phase 3: Maintainability

1. Add migrations/schema verification.
2. Add ESLint and formatting checks.
3. Add MySQL-backed CI integration tests.
4. Add pagination and order validation before scaling list endpoints.
5. Add API versioning when a stable public API contract is needed.

## Verification Snapshot

At review time, the configured test suite was last observed passing with the database-backed users CRUD test and route tests. Re-run from the project directory before accepting changes:

```powershell
npm test
```

The current test count and database availability should be treated as environment-dependent until CI provisions MySQL explicitly.

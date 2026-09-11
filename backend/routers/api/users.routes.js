import express from "express";
import { userValidationRules } from "#validators/user.validation";

/**
 * Sets up the user-related routes for the application.
 * @param {UsersController} usersController - The controller handling operations for multiple users.
 * @returns {express.Router} The configured router for user routes.
 */
export default function usersRoutes(usersController) {

    const router = express.Router();

    router.post("/", userValidationRules.create, usersController.createUser.bind(usersController));

    router.get("/all", usersController.list.bind(usersController));
    router.get("/me", usersController.getCurrentUser.bind(usersController));

    router.get("/:id", userValidationRules.get, usersController.findUser.bind(usersController));
    router.put("/:id", userValidationRules.update, usersController.updateUser.bind(usersController));
    router.delete("/:id", userValidationRules.delete, usersController.deleteUser.bind(usersController));

    //#region /users/:id/orders
    router.get("/:id/orders", usersController.listOrders.bind(usersController));
    router.get("/:id/tasks", usersController.listTasks.bind(usersController));

    return router;
}
import express from "express";
import { userValidationRules } from "../../validationRules/userValidationRules.js";

/**
 * Sets up the user-related routes for the application.
 * @param {UserController} userController - The controller handling user operations.
 * @param {UsersController} usersController - The controller handling operations for multiple users.
 * @returns {express.Router} The configured router for user routes.
 */
export default function userRoutes(userController, usersController) {

    const router = express.Router();

    router.get("/", async (req, res) => { res.redirect("/users.html"); });
    router.post("/", userValidationRules.create, userController.createUser.bind(userController));

    router.get("/all", usersController.list.bind(usersController));
    router.get("/me", userController.getCurrentUser.bind(userController));

    router.get("/:id", userValidationRules.get, userController.findUser.bind(userController));
    router.put("/:id", userValidationRules.update, userController.updateUser.bind(userController));
    router.delete("/:id", userValidationRules.delete, userController.deleteUser.bind(userController));

    //#region /users/:id/orders
    router.get("/:id/orders", userController.listOrders.bind(userController));

    return router;
}
import express from "express";
import { authValidationRules } from "#validators/auth.validation";
import { userValidationRules } from "#validators/user.validation";

/**
 * Sets up the authentication routes for the application.
 * @param {AuthController} authController - An instance of AuthController to handle login requests.
 * @param {UsersController} usersController - An instance of UsersController to handle user-related requests.
 * @returns {express.Router} - The configured router with authentication routes.
 */
export default function authRoutes(authController, usersController) {

    const router = express.Router();

    router.get("/", authController.checkLogin.bind(authController));
    router.post("/", authValidationRules.login, authController.login.bind(authController));

    router.post("/refresh", authController.refreshToken.bind(authController));

    router.post("/signup", userValidationRules.create, usersController.createUser.bind(usersController));
    router.post("/logout", authController.logout.bind(authController));

    return router;
}
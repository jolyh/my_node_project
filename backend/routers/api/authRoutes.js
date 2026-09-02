import express from "express";
import { authValidationRules } from "../../validationRules/authValidationRules.js";
import { userValidationRules } from "../../validationRules/usersValidationRules.js";

/**
 * Sets up the login routes for the application.
 * @param {LoginController} loginController - An instance of LoginController to handle login requests.
 * @returns {express.Router} - The configured router with login routes.
 */
export default function authRoutes(loginController, userController) {

    const router = express.Router();
    router.get("/", loginController.checkLogin.bind(loginController));
    router.post("/", authValidationRules.login, loginController.login.bind(loginController));
    router.post("/signup", userValidationRules.create, userController.createUser.bind(userController));

    return router;
}
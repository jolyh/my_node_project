import config from "../../configs/config.js";
import { AppError, errorTypes } from "../../errors/AppError.js";
import { successLoginResponse } from "../../models/loginResponse.js";
import Logger from '../../utils/Logger.js';

class AuthController {

    /**
     * @param {AuthService} authService - An instance of AuthService for handling authentication logic.
     */
    constructor(authService) {
        if (!authService) throw new AppError(
            errorTypes.INTERNAL_ERRORS.CONTROLLER_MISSING_REQUIRED_SERVICE,
            "AuthController requires an authService"
        );
        this.authService = authService;
    }

    async checkLogin(req, res) {
        const token = req.cookies[config.JWT_COOKIE_NAME];
        if (!token) {
            throw new AppError(
                errorTypes.AUTH.MISSING_TOKEN,
                'Access denied. No token provided.'
            );
        }
        const currentUser = await this.authService.verifyToken(token);
        if (currentUser) {
            Logger.info(currentUser.id, req.headers['x-request-id'], 'Authenticated user redirected to users page.');
            res.redirect("/users.html"); // Redirect to users page if logged in
        } else {
            throw new AppError(
                errorTypes.AUTH.INVALID_TOKEN,
                'Invalid or expired token.'
            );
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        const { sanitizedUser, token } = await this.authService.loginUser(email, password);

        if (token) {
            Logger.info(sanitizedUser.id, req.headers['x-request-id'], 'Login succeeded.');
            this.setJWTCookie(res, token);
            const response = { 
                ...successLoginResponse,
                user: sanitizedUser,
                token 
            };
            res.json(response);
        } else {
            throw new AppError(
                errorTypes.AUTH.INVALID_CREDENTIALS,
                'Invalid email or password.'
            );
        }
    }

    logout(req, res) {
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], 'User logged out.');
        this.clearJWTCookie(res);
        res.json({ message: "Logged out successfully" });
    }

    setJWTCookie(res, token) {
        res.cookie(config.JWT_COOKIE_NAME, token, {
            httpOnly: true, // Prevents client-side JS from stealing the token
            secure: process.env.NODE_ENV === 'production', // Use true in production (HTTPS)
            sameSite: 'strict' // Guards against CSRF attacks
        });
    }
    clearJWTCookie(res) {
        res.clearCookie(config.JWT_COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }
}

export default AuthController;
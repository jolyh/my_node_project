import jwtConfig from '#configs/jwt.config';
import { AppError, errorTypes } from "#errors/AppError";
import { successLoginResponse } from "#models/loginResponse";
import Logger from '#utils/Logger';
import AuthService from '#services/AuthService';

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


    //#region Login Check Method
    async checkLogin(req, res) {
        const token = req.cookies[jwtConfig.JWT_COOKIE_NAME];
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
    //#endregion

    //#region Authentication Methods
    /**
     * Handles user login by validating credentials and issuing a JWT token.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     */
    async login(req, res) {
        const { email, password } = req.body;

        const { user, token, expireAt } = await this.authService.loginUser(email, password);

        if (token) {
            Logger.info(user.id, req.headers['x-request-id'], 'Login succeeded.');
            this.setJWTCookie(res, token);
            const response = {
                ...successLoginResponse,
                user,
                token,
                expireAt
            };
            res.json(response);
        } else {
            throw new AppError(
                errorTypes.AUTH.INVALID_CREDENTIALS,
                'Invalid email or password.'
            );
        }
    }

    /**
    * Logs out the authenticated user by clearing the JWT cookie.
    * @param {Request} req - The HTTP request object.
    * @param {Response} res - The HTTP response object.
    */
    logout(req, res) {
        Logger.info(req.currentUser?.id ?? null, req.headers['x-request-id'], 'User logged out.');
        this.clearJWTCookie(res);
        res.json({ message: "Logged out successfully" });
    }
    //#endregion


    //#region Token Refresh Method
    /**
     * Refreshes the JWT token for the authenticated user.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     */
    async refreshToken(req, res) {
        const token = req.cookies[jwtConfig.JWT_COOKIE_NAME];
        if (!token) {
            throw new AppError(
                errorTypes.AUTH.MISSING_TOKEN,
                'Access denied. No token provided.'
            );
        }
        const newToken = await this.authService.refreshToken(token);
        if (newToken) {
            this.setJWTCookie(res, newToken);
            res.json({ token: newToken });
        } else {
            throw new AppError(
                errorTypes.AUTH.INVALID_TOKEN,
                'Invalid or expired token.'
            );
        }
    }
    //#endregion

    //#region JWT Cookie Management
    /**
     * Sets the JWT cookie for the authenticated user.
     * @param {Response} res - The HTTP response object.
     * @param {string} token - The JWT token to set in the cookie.
     */
    setJWTCookie = (res, token) => {
        res.cookie(jwtConfig.JWT_COOKIE_NAME, token, {
            httpOnly: true, // Prevents client-side JS from stealing the token
            secure: process.env.NODE_ENV === 'production', // Use true in production (HTTPS)
            sameSite: 'strict' // Guards against CSRF attacks
        });
    }
    /**
     * Clears the JWT cookie for the authenticated user.
     * @param {Response} res - The HTTP response object.
     */
    clearJWTCookie = (res) => {
        res.clearCookie(jwtConfig.JWT_COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }
    //#endregion
}

export default AuthController;
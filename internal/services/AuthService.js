import hashUtils from '../utils/hashUtils.js';
import { jwtService } from '../middleware/jwtService.js';
import { AppError, errorTypes } from '../errors/AppError.js';
import Logger from '../utils/Logger.js';
import User from '../models/users/user.js';

export default class AuthService {

    constructor(userRepository) {
        if (!userRepository) throw new AppError(
            errorTypes.SERVICE_ERRORS.MISSING_REQUIRED_REPOSITORY,
            "AuthService requires a userRepository"
        );
        this.userRepository = userRepository;
    }

    async verifyToken(token) {
        if (!token) {
            return false;
        }
        try {
            const decoded = jwtService.verify(token);
            return decoded;
        } catch (err) {
            return false;
        }
    }

    // #region AUTH
    async loginUser(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await hashUtils.password.compare(password, user.password);
        if (!isPasswordValid) {
            Logger.info(user.id, null, 'Login failed: invalid password.');
            return null;
        }
        const token = await jwtService.sign(user.id, user.email, user.role);
        const response = { sanitizedUser: User.sanitize(user), token };
        return response;
    }

    async logoutUser(token) {
        // In a stateless JWT authentication system, logout is typically handled on the client side by removing the token.
        // However, if you want to implement server-side token invalidation, you can maintain a blacklist of tokens.
        // For this example, we'll just return true to indicate a successful logout.
        return true;
    }
    // #endregion

}
import hashUtils from '#utils/hash.utils';
import { jwtUtils } from '#utils/jwt.utils';
import { AppError, errorTypes } from '#errors/AppError';
import Logger from '#utils/Logger';
import User from '#models/users/user';

export default class AuthService {

    constructor(userRepository) {
        if (!userRepository) throw new AppError(
            errorTypes.SERVICE_ERRORS.MISSING_REQUIRED_REPOSITORY,
            "AuthService requires a userRepository"
        );
        this.userRepository = userRepository;
    }

    //#region JWT Methods
    async verifyToken(token) {
        if (!token) {
            return false;
        }
        try {
            const decoded = jwtUtils.verify(token);
            return decoded;
        } catch (err) {
            return false;
        }
    }

    async refreshToken(token) {
        if (!token) {
            return null;
        }
        try {
            const newToken = await jwtUtils.refresh(token);
            return newToken;
        } catch (err) {
            return null;
        }
    }
    //#endregion

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
        
        const { token, expireAt } = await jwtUtils.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const response = { 
            user: User.sanitize(user), 
            token,
            expireAt
        };
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